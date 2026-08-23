const required = [
  "DATABASE_URL",

  "AUTH_SECRET",
  "NEXTAUTH_URL",
  "APP_URL",

  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",

  "OPENAI_API_KEY",

  "RESEND_API_KEY",
  "EMAIL_FROM",

  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PROFESSIONAL_PRICE_ID",

  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",

  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "GOOGLE_CALENDAR_ID",
] as const;

export function validateEnvironment() {
  const missingRequired = required.filter(
    (key) => !process.env[key]?.trim(),
  );

  if (missingRequired.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingRequired.join("\n")}`,
    );
  }
}
