# Render deployment

RecruiterAI OS deploys as one Node.js web service. Express serves both the compiled React
application and the `/api/v1` API, which keeps authentication cookies same-origin and avoids
cross-site CORS configuration.

## Before deploying

1. Rotate any credentials that have been shared outside your password manager.
2. Merge the verified deployment branch into `main`.
3. In MongoDB Atlas, create a database user and permit connections from the Render service.
4. Keep real secrets in Render environment variables only. Never copy the local `.env` file
   into Git.

## Blueprint deployment

1. In Render, choose **New > Blueprint** and connect the GitHub repository.
2. Render detects the root `render.yaml` file.
3. Enter the prompted environment variables:

   | Variable         | Value                                                                     |
   | ---------------- | ------------------------------------------------------------------------- |
   | `WEB_URL`        | The final HTTPS Render URL, such as `https://recruiterai-os.onrender.com` |
   | `MONGODB_URI`    | Rotated MongoDB Atlas connection string                                   |
   | `GEMINI_API_KEY` | Gemini API key; optional because deterministic matching is available      |
   | `RESEND_API_KEY` | Rotated Resend API key; optional                                          |
   | `EMAIL_FROM`     | Verified sender, or leave blank while email is disabled                   |

   Render generates the JWT and cookie secrets defined by the Blueprint.

4. Deploy and wait for `/api/v1/health` to report `status: ok` and `database: connected`.

## Existing manual Render service

If a service was created before the Blueprint, set its repository root to the repository root
(not `apps/web`) and use:

```text
Build command: npm ci && npm run build
Start command: npm run start -w @recruiterai/api
Health check: /api/v1/health
```

The service branch must contain the monorepo. The initial `main` snapshot does not contain the
API workspace and cannot run the start command.

## Production smoke test

After deployment, verify:

1. `/` loads the public landing page over HTTPS.
2. `/api/v1/health` reports a connected database.
3. Register, log out, log in, and refresh the page.
4. Create and publish a job.
5. Upload a synthetic resume and run candidate matching.
6. Schedule an interview, open its Calendar link, and submit feedback.
7. Confirm analytics update and then remove the smoke-test records.

Render's free service can sleep after inactivity, so the first request can be slow. It is suitable
for a portfolio deployment, not a service-level production workload.
