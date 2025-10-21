import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
  APP_BASE_URL
} = process.env;

const parseSecure = () => {
  // Allow string-based booleans to set TLS requirement
  if (typeof SMTP_SECURE === "string") {
    return ["true", "1", "yes"].includes(SMTP_SECURE.toLowerCase());
  }
  if (SMTP_PORT) {
    return Number(SMTP_PORT) === 465;
  }
  return false;
};

const smtpConfigured = SMTP_HOST && SMTP_USER && SMTP_PASS && EMAIL_FROM;

const transporter = smtpConfigured
  // Create an SMTP transport when credentials are present
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? Number(SMTP_PORT) : undefined,
      secure: parseSecure(),
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
  : null;

if (!smtpConfigured) {
  console.warn("[MAIL] SMTP configuration incomplete; emails will be logged to console.");
}

const logFallback = async ({ to, subject, text, html }) => {
  console.info("[MAIL:log]", { to, subject, text, html });
};

const dispatch = async (options) => {
  // Default to logging when config is incomplete so local dev still works
  if (!EMAIL_FROM) {
    console.warn("[MAIL] EMAIL_FROM missing; logging email instead of sending.");
    return logFallback(options);
  }
  if (!transporter) return logFallback(options);
  await transporter.sendMail({ from: EMAIL_FROM, ...options });
};

const formatResetLink = (token) => {
  // Build password reset URL using APP_BASE_URL when available
  const base = (APP_BASE_URL || "").replace(/\/+$/, "");
  if (!base) return `https://example.com/reset?token=${encodeURIComponent(token)}`;
  return `${base}/reset?token=${encodeURIComponent(token)}`;
};

export const sendVerificationCode = async (to, code) => {
  const subject = "Verify your email";
  const text = `Your verification code is ${code}. It expires in 15 minutes.`;
  const html =
    `<p>Your verification code is <strong>${code}</strong>.</p>` +
    "<p>The code expires in 15 minutes. If you did not create an account, you can ignore this email.</p>";
  await dispatch({ to, subject, text, html });
};

export const sendPasswordReset = async (to, token) => {
  const link = formatResetLink(token);
  const subject = "Reset your password";
  const text =
    `We received a request to reset your password.\n\n` +
    `Use the link below to choose a new password:\n${link}\n\n` +
    "This link expires in 30 minutes. If you did not request this, you can ignore this email.";
  const html =
    "<p>We received a request to reset your password.</p>" +
    `<p><a href="${link}">${link}</a></p>` +
    "<p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>";
  await dispatch({ to, subject, text, html });
};
