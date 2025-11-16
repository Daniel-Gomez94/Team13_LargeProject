import { jest } from "@jest/globals";

// Provide safe defaults so unit tests can run without relying on developer machines
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test-db";
process.env.EMAIL_FROM = process.env.EMAIL_FROM || "noreply@example.com";
process.env.APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:5173";

jest.setTimeout(30000);

afterEach(() => {
  // Reset mock call counts between tests to avoid cross-test bleed
  jest.clearAllMocks();
});
