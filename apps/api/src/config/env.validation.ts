/**
 * Typed environment variable validation.
 *
 * Used as the `validate` callback in ConfigModule.forRoot so that the
 * application fails fast at boot when required variables are missing or
 * malformed.  No external schema library is required.
 */

export interface AppConfig {
  /** TCP port the HTTP server listens on. Defaults to 3000. */
  PORT: number;
  /**
   * Comma-separated list of allowed CORS origins.
   * Defaults to the local dashboard and admin dev ports when not set.
   */
  CORS_ORIGINS: string;
  /**
   * Database connection string.
   * Optional – documented as a placeholder for the future DB layer.
   * The application does NOT connect to it yet.
   */
  DATABASE_URL?: string;
}

/**
 * Validates and coerces the raw process.env values into a typed
 * {@link AppConfig} object.  Throws with a descriptive message when
 * a required variable is absent or has an unexpected value.
 */
export function validateEnv(config: Record<string, unknown>): AppConfig {
  const errors: string[] = [];

  // PORT – optional, must be a positive integer when provided
  let port = 3000;
  if (config["PORT"] !== undefined && config["PORT"] !== "") {
    const parsed = parseInt(String(config["PORT"]), 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 65535) {
      errors.push(`PORT must be an integer between 1 and 65535 (got "${config["PORT"]}")`);
    } else {
      port = parsed;
    }
  }

  // CORS_ORIGINS – optional string; defaults applied in main.ts via ConfigService
  const corsOrigins =
    config["CORS_ORIGINS"] !== undefined && config["CORS_ORIGINS"] !== ""
      ? String(config["CORS_ORIGINS"])
      : "http://localhost:3001,http://localhost:3002";

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n  - ${errors.join("\n  - ")}`);
  }

  const result: AppConfig = { PORT: port, CORS_ORIGINS: corsOrigins };

  if (config["DATABASE_URL"]) {
    result.DATABASE_URL = String(config["DATABASE_URL"]);
  }

  return result;
}
