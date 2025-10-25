# 3930 Paradise - Resident Timeline

An interactive web application for residents to document and share events at 3930 Paradise, Las Vegas.

**Unlike "mindfully developed, stylishly elevated, and tastefully curated" luxury living marketing, this is the unfiltered truth.**

## Features

- **Visual Timeline**: Chronological display of resident-submitted events
- **Event Submission**: Easy form to submit incidents with screenshots and documents
- **File Upload**: Support for images and PDFs using UploadThing
- **PII Protection**: Reminders to redact personal information before uploading
- **Brutalist Design**: A stark contrast to polished corporate property management websites

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Prisma** - Database ORM
- **SQLite** - Local database (can be swapped for PostgreSQL in production)
- **UploadThing** - File upload service
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
```

Get your UploadThing token from: https://uploadthing.com

4. Generate Prisma client and create database:
```bash
DATABASE_URL="file:./dev.db" npx prisma generate
DATABASE_URL="file:./dev.db" npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Event
- `id`: Unique identifier
- `title`: Event title
- `description`: Detailed description
- `eventDate`: Date when the event occurred
- `category`: Type of event (maintenance, complaint, violation, notice, fee, other)
- `createdAt`: Submission timestamp
- `updatedAt`: Last update timestamp
- `attachments`: Related files

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
