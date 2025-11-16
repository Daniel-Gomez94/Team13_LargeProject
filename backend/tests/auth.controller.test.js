import { jest } from "@jest/globals";

// Central mocks for controller dependencies to keep unit tests isolated from external services
const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn()
};

const mockVerificationModel = {
  create: jest.fn(),
  deleteMany: jest.fn()
};

const mockPasswordResetModel = {
  create: jest.fn(),
  deleteMany: jest.fn()
};

const mockEmail = {
  sendVerificationCode: jest.fn(),
  sendPasswordReset: jest.fn()
};

const mockCrypto = {
  hash: jest.fn((v) => `hashed-${v}`),
  randomToken: jest.fn(() => "fixed-token"),
  nowPlusMinutes: jest.fn((m) => new Date(Date.now() + m * 60 * 1000))
};

const mockJwt = {
  sign: jest.fn(() => "mock-access-token")
};

const mockBcrypt = {
  hash: jest.fn(() => Promise.resolve("bcrypt-hash")),
  compare: jest.fn(() => Promise.resolve(true))
};

jest.unstable_mockModule("../models/User.js", () => ({ default: mockUserModel }));
jest.unstable_mockModule("../models/Verification.js", () => ({ default: mockVerificationModel }));
jest.unstable_mockModule("../models/PasswordReset.js", () => ({ default: mockPasswordResetModel }));
jest.unstable_mockModule("../utils/email.js", () => mockEmail);
jest.unstable_mockModule("../utils/crypto.js", () => mockCrypto);
jest.unstable_mockModule("bcryptjs", () => ({ default: mockBcrypt }));
jest.unstable_mockModule("jsonwebtoken", () => ({ default: mockJwt }));

const controller = await import("../controllers/auth.controller.js");

const buildResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("auth.controller register", () => {
  it("creates user, saves verification code, and sends email", async () => {
    const now = new Date("2024-01-01T00:00:00Z");
    jest.useFakeTimers().setSystemTime(now);

    mockUserModel.findOne.mockResolvedValue(null);
    const createdUser = { _id: "user123", email: "user@example.com", handle: "user", verified: false };
    mockUserModel.create.mockResolvedValue(createdUser);

    const req = {
      body: { email: "user@example.com", handle: "user", password: "Password123!" }
    };
    const res = buildResponse();
    const next = jest.fn();

    await controller.register(req, res, next);

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      $or: [{ email: req.body.email }, { handle: req.body.handle }]
    });
    expect(mockBcrypt.hash).toHaveBeenCalledWith(req.body.password, 12);
    expect(mockUserModel.create).toHaveBeenCalledWith({
      email: req.body.email,
      handle: req.body.handle,
      passwordHash: "bcrypt-hash",
      verified: false,
      score: 0
    });

    expect(mockVerificationModel.create).toHaveBeenCalledTimes(1);
    const verificationCall = mockVerificationModel.create.mock.calls[0][0];
    expect(verificationCall.userId).toBe(createdUser._id);
    expect(verificationCall.codeHash).toMatch(/^hashed-\d{6}$/);
    expect(verificationCall.expiresAt.getTime()).toBe(now.getTime() + 15 * 60 * 1000);
    expect(mockCrypto.nowPlusMinutes).toHaveBeenCalledWith(15);
    expect(mockCrypto.hash).toHaveBeenCalledWith(expect.stringMatching(/^\d{6}$/));

    expect(mockEmail.sendVerificationCode).toHaveBeenCalledTimes(1);
    const [emailArg, codeArg] = mockEmail.sendVerificationCode.mock.calls[0];
    expect(emailArg).toBe(req.body.email);
    expect(codeArg).toMatch(/^\d{6}$/);

    expect(mockJwt.sign).toHaveBeenCalledWith(
      { id: createdUser._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );
    expect(mockVerificationModel.deleteMany).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      user: { id: createdUser._id, email: createdUser.email, handle: createdUser.handle, verified: createdUser.verified },
      access: "mock-access-token",
      note: "PIN sent (dev: code in logs?)"
    });
    expect(next).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("rejects duplicate email or handle", async () => {
    mockUserModel.findOne.mockResolvedValue({ _id: "existing" });
    const req = { body: { email: "existing@example.com", handle: "existing", password: "Password123!" } };
    const res = buildResponse();
    const next = jest.fn();

    await controller.register(req, res, next);

    expect(next).toHaveBeenCalledWith({
      status: 409,
      code: "USER_EXISTS",
      message: "Email or handle already used"
    });
    expect(mockUserModel.create).not.toHaveBeenCalled();
    expect(mockEmail.sendVerificationCode).not.toHaveBeenCalled();
  });
});

describe("auth.controller requestPasswordReset", () => {
  it("sends reset email when user exists", async () => {
    mockUserModel.findOne.mockResolvedValue({ _id: "user123", email: "user@example.com" });
    const req = { body: { email: "user@example.com" } };
    const res = buildResponse();
    const next = jest.fn();

    await controller.requestPasswordReset(req, res, next);

    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(mockCrypto.randomToken).toHaveBeenCalledWith(32);
    expect(mockCrypto.hash).toHaveBeenCalledWith("fixed-token");
    expect(mockPasswordResetModel.create).toHaveBeenCalledWith({
      userId: "user123",
      tokenHash: "hashed-fixed-token",
      expiresAt: expect.any(Date)
    });
    expect(mockCrypto.nowPlusMinutes).toHaveBeenCalledWith(30);
    expect(mockEmail.sendPasswordReset).toHaveBeenCalledWith(req.body.email, "fixed-token");
    expect(res.json).toHaveBeenCalledWith({ ok: true });
    expect(next).not.toHaveBeenCalled();
    expect(mockPasswordResetModel.deleteMany).not.toHaveBeenCalled();
  });

  it("returns ok without email when user missing", async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    const req = { body: { email: "unknown@example.com" } };
    const res = buildResponse();
    const next = jest.fn();

    await controller.requestPasswordReset(req, res, next);

    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(mockCrypto.randomToken).not.toHaveBeenCalled();
    expect(mockPasswordResetModel.create).not.toHaveBeenCalled();
    expect(mockEmail.sendPasswordReset).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true });
    expect(next).not.toHaveBeenCalled();
  });
});
