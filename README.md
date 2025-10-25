# 3930 Paradise - Resident Timeline

An interactive web application for residents to document and share events at 3930 Paradise, Las Vegas.

**Unlike "mindfully developed, stylishly elevated, and tastefully curated" luxury living marketing, this is the unfiltered truth.**

## Features

- **Visual Timeline**: Chronological display of approved resident-submitted events
- **Secure Submission Portal**: CAPTCHA-protected form to prevent spam and bots
- **Admin Moderation**: Review and approve/reject submissions before they go public
- **File Upload**: Support for images and PDFs using UploadThing
- **PII Protection**: Reminders to redact personal information before uploading
- **Admin Authentication**: Secure login system with iron-session
- **Event Approval Workflow**: All submissions require admin approval before appearing publicly
- **Brutalist Design**: A stark contrast to polished corporate property management websites

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Prisma** - Database ORM
- **SQLite** - Local database (can be swapped for PostgreSQL in production)
- **UploadThing** - File upload service
- **Google reCAPTCHA v3** - Bot protection
- **iron-session** - Secure session management
- **bcryptjs** - Password hashing
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/3930paradise.com.git
cd 3930paradise.com
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the .env file and add your values
cp .env .env.local
```

Edit `.env.local` and add:
```
DATABASE_URL="file:./dev.db"
UPLOADTHING_TOKEN="your_uploadthing_token_here"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your_recaptcha_site_key"
RECAPTCHA_SECRET_KEY="your_recaptcha_secret_key"
SESSION_SECRET="your_32_char_secret_here"
```

**Get your API keys:**
- UploadThing token: https://uploadthing.com
- reCAPTCHA keys: https://www.google.com/recaptcha/admin (use v3)
- Session secret: Generate with `openssl rand -base64 32`

4. Generate Prisma client and create database:
```bash
DATABASE_URL="file:./dev.db" npx prisma generate
DATABASE_URL="file:./dev.db" npx prisma db push
```

5. Create an admin user:
```bash
npm run create-admin
```

Follow the prompts to set up your admin username and password.

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Portal

Access the admin portal at `/admin/login` to:
- Review pending event submissions
- Approve or reject events
- Delete approved events if needed
- View submitter contact information (if provided)

**Default URL**: http://localhost:3000/admin/login

Use the credentials you created with `npm run create-admin`.

## Database Schema

### Event
- `id`: Unique identifier
- `title`: Event title
- `description`: Detailed description
- `eventDate`: Date when the event occurred
- `category`: Type of event (maintenance, complaint, violation, notice, fee, other)
- `isApproved`: Whether admin has approved the event (default: false)
- `approvedAt`: Timestamp of approval
- `approvedBy`: Admin username who approved it
- `submitterEmail`: Optional contact email (not publicly displayed)
- `createdAt`: Submission timestamp
- `updatedAt`: Last update timestamp
- `attachments`: Related files

### Admin
- `id`: Unique identifier
- `username`: Admin login username
- `passwordHash`: Bcrypt hashed password
- `createdAt`: Account creation timestamp

### Attachment
- `id`: Unique identifier
- `eventId`: Reference to parent event
- `fileName`: Original file name
- `fileUrl`: URL to uploaded file
- `fileType`: "image" or "document"
- `isPiiRedacted`: Whether PII has been removed
- `redactionAreas`: JSON data for blur areas (future feature)
- `createdAt`: Upload timestamp

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL` (use Vercel Postgres or other hosted DB)
   - `UPLOADTHING_TOKEN`
4. Deploy!

### Environment Variables for Production

For production, consider using Vercel Postgres instead of SQLite:

```
DATABASE_URL="postgres://..."
UPLOADTHING_TOKEN="your_token"
```

Update `prisma/schema.prisma` datasource to use PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run migrations:
```bash
npx prisma migrate dev --name init
```

## Project Structure

```
3930paradise.com/
├── app/
│   ├── api/
│   │   ├── events/          # Event CRUD API
│   │   └── uploadthing/     # File upload handlers
│   ├── submit/              # Event submission page
│   ├── page.tsx             # Main timeline page
│   └── layout.tsx           # Root layout
├── lib/
│   ├── db.ts                # Prisma client
│   └── uploadthing.ts       # Upload components
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
```

## Design Philosophy

This site intentionally contrasts with typical luxury apartment marketing:

**Elysian Living** (typical corporate):
- Soft colors, generous whitespace
- "Mindfully developed, stylishly elevated"
- Professional photography, aspirational lifestyle
- Minimalist luxury aesthetic

**3930 Paradise** (this site):
- Brutalist black/white/red/yellow
- Dense, functional information display
- Raw, unfiltered documentation
- Truth over polish

## Contributing

Residents can submit events directly through the `/submit` page. All submissions are public and permanent.

## Privacy & Legal

- **Remove personal information** before uploading any documents
- Be factual and avoid defamation
- This site is for documentation purposes only
- Not affiliated with Elysian Living or property management

## License

MIT License - See LICENSE file for details

---

**Built by residents, for residents. No marketing. No luxury branding. Just facts.**
