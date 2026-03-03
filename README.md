This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Member Registration + Directus Setup

This project now includes a member registration modal that opens from **Become a Member** buttons and submits to:

- `POST /api/member-register`

After submit, users get a second confirmation modal saying review takes **2-3 days** and their status is **pending**.

### 1) Environment Variables

Create `.env.local` with:

```env
DIRECTUS_URL=https://admin.sldiaspora.org
DIRECTUS_ADMIN_TOKEN=your_directus_static_admin_token
```

`DIRECTUS_ADMIN_TOKEN` must have permission to:

- create files (`directus_files`)
- create items in `members`

### 2) Create `members` collection in Directus

Collection: `members`

Suggested fields:

- `full_name` (string, required)
- `phone` (string, required)
- `address` (text, required)
- `profession` (string, optional)
- `national_id_code` (string, optional)
- `national_id_photo` (file, optional, relation to Directus Files)
- `additional_notes` (text, optional)
- `submitted_at` (datetime, optional)
- `status` (string or status field, default `pending`)

If you also create `email` and `country` in Directus later, the modal already captures them and you can map/store them in the API.

### 3) Admin verification flow

- New registrations are stored with `status = pending`.
- Admin reviews in Directus and changes status to `active`.
- Once active, your dashboard logic can allow access to member profile, activities, and articles.

## Member Activation Welcome Email

When a member status is `active` or `published`, the app can send a welcome email with:

- full name
- email
- phone
- verification message
- member login link (`/member-login`)

### Required `members` field for one-time email

Add one datetime field in Directus `members` collection (any one of these names):

- `activation_email_sent_at` (recommended)
- `welcome_email_sent_at`
- `status_notification_sent_at`

This prevents duplicate emails.

### Automatic trigger points

1. Login trigger (already enabled)

- On `POST /api/member-auth/login`, if member is active/published and email has not been sent, welcome email is sent once.

2. Immediate admin status-change trigger (recommended)

- Endpoint: `POST /api/member-auth/activation-notify`
- Optional header for security: `x-member-webhook-secret`

Add this env if you want to secure the endpoint:

```env
MEMBER_STATUS_WEBHOOK_SECRET=your_secret_here
NEXT_PUBLIC_SITE_URL=https://your-site-domain.com
```

Example webhook payload:

```json
{
	"memberId": "123",
	"status": "active"
}
```

Use a Directus Flow/Webhook on `members` update where status changes to `active` or `published`.

### Security note

For safety, passwords are not included in email. Members should use the password they created during registration.
