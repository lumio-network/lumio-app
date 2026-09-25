import { ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { AllExceptionsFilter } from "./all-exceptions.filter";

describe("AllExceptionsFilter", () => {
  const createHost = () => {
    const json = jest.fn();
    const response = { status: jest.fn().mockReturnValue({ json }) };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => ({ url: "/health" }),
      }),
    } as unknown as ArgumentsHost;

    return { host, response, json };
  };

  it("wraps unknown errors in an internal server error envelope", () => {
    const filter = new AllExceptionsFilter();
    const { host, response, json } = createHost();

    filter.catch(new Error("database unavailable"), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "database unavailable",
        error: "Internal Server Error",
        path: "/health",
      }),
    );
  });

  it("preserves an HttpException status and message", () => {
    const filter = new AllExceptionsFilter();
    const { host, response, json } = createHost();

    filter.catch(new HttpException("service unavailable", HttpStatus.SERVICE_UNAVAILABLE), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 503,
        message: "service unavailable",
        error: "Service Unavailable",
      }),
    );
  });
});
