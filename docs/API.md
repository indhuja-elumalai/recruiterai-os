# API Reference

Base URL: `/api/v1`. JSON endpoints return `{ data, requestId }`; failures return
`{ error: { code, message, requestId, details? } }`.

## Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /auth/development/reset-password` — development only

## Jobs

- `GET /jobs`
- `POST /jobs`
- `PATCH /jobs/:jobId`

## Candidates and resumes

- `GET /candidates`
- `POST /candidates` — multipart fields: `payload` JSON and `resume` PDF/TXT
- `PATCH /candidates/:candidateId/status`

## Explainable matching

- `GET /matches`
- `POST /matches/candidates/:candidateId`

## Interviews

- `GET /interviews`
- `POST /interviews`
- `PATCH /interviews/:interviewId/status`
- `PUT /interviews/:interviewId/feedback`

## Analytics and operations

- `GET /analytics/overview`
- `GET /health`

All endpoints after authentication require `Authorization: Bearer <access-token>` except
refresh/logout, which use the signed refresh cookie. Shared schemas in
`packages/contracts/src/index.ts` are the canonical request and response specification.
