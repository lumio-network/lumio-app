# Lumio API

The API is a NestJS service that connects the application to Lumio contracts through `@lumio/sdk`.
See the [repository README](../../README.md) for setup and configuration, and the
[NestJS documentation](https://docs.nestjs.com/) for framework guidance.

## Routes

| Method | Path             | Status                                   | Response                                                                         |
| ------ | ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| `GET`  | `/health`        | `200` when healthy; `503` when unhealthy | Health status and liveness indicator; see details below.                         |
| `GET`  | `/metrics`       | `200`                                    | Prometheus text exposition containing process metrics and `http_requests_total`. |
| `GET`  | `/v1/treasury`   | `501`                                    | Treasury scaffold response.                                                      |
| `GET`  | `/v1/governance` | `501`                                    | Governance scaffold response, including an empty tally.                          |
| `GET`  | `/v1/dividends`  | `501`                                    | Dividends scaffold response.                                                     |
| `GET`  | `/docs`          | `200`                                    | Swagger UI.                                                                      |
| `GET`  | `/docs-json`     | `200`                                    | OpenAPI document.                                                                |

The domain routes are placeholders and do not read contract state yet. Operational endpoints (`/health`, `/metrics`)
and Swagger documentation (`/docs`, `/docs-json`) are unversioned (version-neutral).

Run `pnpm --filter @lumio/api test:cov` to generate an API coverage report. Jest currently enforces
a 20% global floor for statements, branches, and lines, and 25% for functions; these are starting
floors to raise as route and infrastructure coverage grows.

## Operational routes

### Health check (`GET /health`)

The health endpoint is a readiness probe that reports service health and runtime uptime:

- **Path:** `/health` (unversioned / version-neutral).
- **Rate limiting:** Exempt from the global throttling guard via `@SkipThrottle()`, allowing uninterrupted polling by container runtimes and load balancers.
- **Docker Compose health check:** The local containerized setup in [`docker-compose.yml`](../../docker-compose.yml) uses this endpoint to verify container readiness via Node.js fetch:
  ```bash
  http://127.0.0.1:3000/health
  ```
- **Status codes & responses:**
  - `200 OK`: Returned when the service is healthy.
  - `503 Service Unavailable`: Returned with the global exception envelope when any health indicator reports an unhealthy status.

Healthy response (`200`):

```json
{
  "status": "ok",
  "service": "lumio-api",
  "time": "2026-01-01T00:00:00.000Z",
  "indicators": {
    "liveness": { "status": "up", "details": "uptime: 123s" }
  }
}
```

Unhealthy response (`503`) uses the global exception envelope:

```json
{
  "statusCode": 503,
  "message": "Http Exception",
  "error": "HttpException",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "path": "/health"
}
```

### Metrics (`GET /metrics`)

The metrics endpoint exposes runtime and operational metrics in Prometheus text exposition format (`Content-Type: text/plain; version=0.0.4; charset=utf-8`):

- **Path:** `/metrics` (unversioned / version-neutral).
- **Documentation exclusion:** Hidden from the OpenAPI document and Swagger UI via `@ApiExcludeEndpoint()`, keeping `/docs` scoped to domain API consumers.
- **Rate limiting:** Throttled by the global `ThrottlerGuard` according to `RATE_LIMIT_TTL_MS` (window in ms) and `RATE_LIMIT_LIMIT` (max requests per window).
- **Status codes:** `200 OK` on successful scrape.
- **Exposed series and labels:**
  - `process_cpu_user_seconds_total` (counter): Total user CPU time spent in seconds.
  - `process_cpu_system_seconds_total` (counter): Total system CPU time spent in seconds.
  - `process_cpu_seconds_total` (counter): Total user and system CPU time spent in seconds.
  - `process_start_time_seconds` (gauge): Process start time in seconds since the Unix epoch.
  - `process_uptime_seconds` (gauge): Process uptime in seconds.
  - `process_resident_memory_bytes` (gauge): Resident memory size (RSS) in bytes.
  - `nodejs_heap_size_total_bytes` (gauge): Total V8 heap size in bytes.
  - `nodejs_heap_size_used_bytes` (gauge): V8 heap size currently used in bytes.
  - `nodejs_external_memory_bytes` (gauge): Memory used by C++ objects bound to JavaScript objects.
  - `nodejs_version_info` (gauge): Static gauge (`1`) with labels `version`, `major`, `minor`, and `patch`.
  - `http_requests_total` (counter): Completed HTTP requests, labeled by `method` (HTTP verb, e.g. `GET`, `POST`) and `status_code` (e.g. `200`, `501`).

Example Prometheus exposition output:

```text
# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total 0.124800
# HELP process_uptime_seconds Process uptime in seconds.
# TYPE process_uptime_seconds gauge
process_uptime_seconds 42.150
# HELP process_resident_memory_bytes Resident memory size in bytes.
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 68157440
# HELP http_requests_total Total HTTP requests completed.
# TYPE http_requests_total counter
http_requests_total{method="GET",status_code="200"} 12
http_requests_total{method="GET",status_code="501"} 3
```

## Domain scaffold responses

`GET /v1/treasury` (`501`):

```json
{ "contract": "treasury", "status": "not-implemented" }
```

`GET /v1/governance` (`501`):

```json
{
  "contract": "governance",
  "status": "not-implemented",
  "tally": { "yes": 0, "no": 0, "abstain": 0 }
}
```

`GET /v1/dividends` (`501`):

```json
{ "contract": "dividends", "status": "not-implemented" }
```
