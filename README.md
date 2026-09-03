# LinkLite — LiteAI URL Shortener

A clean, mobile-first URL shortener using the LiteAI API.

## Features

- Long URL → short URL
- Copy and open buttons
- QR code generation
- Recent links stored locally in the browser
- Dark/light mode
- Responsive mobile UI
- PWA install support
- API key stays server-side
- GitHub-ready structure

## 1. Install

Requires Node.js 18+.

```bash
npm install
```

## 2. Configure the API key

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then set:

```env
LITEAI_API_KEY=your_key_here
PORT=3000
```

Do NOT commit `.env` to GitHub.

## 3. Run

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## API integration

The backend sends:

```http
POST https://liteai.in/api/create
Authorization: Bearer YOUR_KEY
Content-Type: application/json
```

with:

```json
{"long_url":"https://example.com"}
```

The server accepts several common response field names (`short_url`, `shortUrl`, `url`, `short`, and nested `data` variants) so the UI is resilient if the provider response differs slightly.

## Deploy

Deploy this Node/Express project to any Node hosting provider that supports environment variables.

Set the environment variable:

`LITEAI_API_KEY`

Do not put the secret in `public/` or frontend JavaScript.

## Security

The supplied API key should be treated as a secret. If it has been posted publicly or committed to a repository, rotate/revoke it at the provider and replace it in `.env`.

## Note about QR

The QR button uses a public QR image endpoint in the browser. If you want fully self-hosted QR generation, replace it with a local QR library.
