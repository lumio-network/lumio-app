import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

type ErrorResponse = {
  statusCode: number;
  message: string | string[] | object;
  error: string;
  timestamp: string;
  path: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const body: ErrorResponse = {
      statusCode,
      message: this.getMessage(exception, exceptionResponse),
      error: this.getError(exceptionResponse, statusCode),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(body);
  }

  private getMessage(exception: unknown, exceptionResponse: string | object | undefined) {
    if (typeof exceptionResponse === "string") {
      return exceptionResponse;
    }

    if (exceptionResponse && "message" in exceptionResponse) {
      return exceptionResponse.message as string | string[] | object;
    }

    return exception instanceof Error ? exception.message : "Internal server error";
  }

  private getError(exceptionResponse: string | object | undefined, statusCode: number) {
    if (
      exceptionResponse &&
      typeof exceptionResponse === "object" &&
      "error" in exceptionResponse
    ) {
      return String(exceptionResponse.error);
    }

    return HttpStatus[statusCode] ?? "Internal Server Error";
  }
}
