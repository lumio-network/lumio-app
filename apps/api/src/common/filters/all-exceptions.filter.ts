import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";

/**
 * Global exception filter that normalises every thrown error into a
 * consistent JSON envelope so dashboard/admin consumers always get a
 * predictable body shape.
 *
 * Envelope:
 *   { statusCode, message, error, timestamp, path }
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    // We avoid importing from 'express' directly so this package does not
    // require @types/express as a devDependency.  The response/request objects
    // are typed via a minimal structural interface instead.
    const response = ctx.getResponse<{
      status(code: number): { json(body: unknown): void };
    }>();
    const request = ctx.getRequest<{ method: string; url: string }>();

    const { statusCode, message, error } = this.extractErrorDetails(exception);

    this.logger.error(
      `${request.method} ${request.url} → ${statusCode}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private extractErrorDetails(exception: unknown): {
    statusCode: number;
    message: string;
    error: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === "object" && responseBody !== null) {
        const body = responseBody as Record<string, unknown>;
        return {
          statusCode: status,
          message: typeof body["message"] === "string" ? body["message"] : exception.message,
          error: typeof body["error"] === "string" ? body["error"] : exception.name,
        };
      }

      return {
        statusCode: status,
        message: typeof responseBody === "string" ? responseBody : exception.message,
        error: exception.name,
      };
    }

    // Non-HTTP (unexpected) errors → 500
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception instanceof Error ? exception.message : "Internal server error",
      error: "Internal Server Error",
    };
  }
}
