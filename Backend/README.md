# Backend Setup

## Environment Variables

Create a `.env` file in this directory with the values below:

- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – secret used to sign access tokens
- `JWT_EXPIRES` – optional expiry (e.g. `15m`)
- `CLIENT_ORIGIN` – optional comma-separated list of allowed origins for CORS
- `EMAIL_FROM` – email address that appears in the From field
- `SMTP_HOST` – SMTP server host
- `SMTP_PORT` – SMTP server port (e.g. `587`)
- `SMTP_SECURE` – `true` if the SMTP server requires TLS on connect (port 465)
- `SMTP_USER` / `SMTP_PASS` – credentials for the SMTP server
- `APP_BASE_URL` – public URL where the frontend serves the reset password page (used in reset links)

## Install & Run

```bash
npm install
npm run dev
```

The API will listen on port 4000 by default (`PORT` overrides). Health checks: `/healthz`, `/readyz`.

## Testing

```bash
npm test
```

The Jest suite runs in Node ESM mode (`--experimental-vm-modules`). Tests rely on mocked dependencies and do not require external services.
