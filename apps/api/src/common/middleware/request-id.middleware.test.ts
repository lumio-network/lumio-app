import { RequestIdMiddleware } from "./request-id.middleware";

describe("RequestIdMiddleware", () => {
  let middleware: RequestIdMiddleware;
  let mockResponse: { setHeader: jest.Mock };
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
    mockResponse = { setHeader: jest.fn() };
    next = jest.fn();
  });

  it("echoes an inbound x-request-id header verbatim", () => {
    const request = {
      headers: { "x-request-id": "custom-trace-id-12345" },
    };

    middleware.use(request, mockResponse, next);

    expect(mockResponse.setHeader).toHaveBeenCalledWith("X-Request-Id", "custom-trace-id-12345");
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("generates a non-empty id when x-request-id is missing", () => {
    const request = { headers: {} };

    middleware.use(request, mockResponse, next);

    expect(mockResponse.setHeader).toHaveBeenCalledWith("X-Request-Id", expect.any(String));
    const generatedId = mockResponse.setHeader.mock.calls[0][1];
    expect(typeof generatedId).toBe("string");
    expect(generatedId.length).toBeGreaterThan(0);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("generates a new id when x-request-id is empty or whitespace only", () => {
    const request = { headers: { "x-request-id": "   " } };

    middleware.use(request, mockResponse, next);

    expect(mockResponse.setHeader).toHaveBeenCalledWith("X-Request-Id", expect.any(String));
    const generatedId = mockResponse.setHeader.mock.calls[0][1];
    expect(generatedId.trim().length).toBeGreaterThan(0);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("sets the header before calling next so it is attached on both success and error responses", () => {
    const request = { headers: {} };
    const failingNext = jest.fn(() => {
      throw new Error("handler failed");
    });

    expect(() => middleware.use(request, mockResponse, failingNext)).toThrow("handler failed");
    expect(mockResponse.setHeader).toHaveBeenCalledWith("X-Request-Id", expect.any(String));
  });
});
