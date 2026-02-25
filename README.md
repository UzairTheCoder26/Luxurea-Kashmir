# Luxureakashmir

A production-ready luxury e-commerce website for Luxureakashmir.com — timeless Kashmiri elegance, heritage craftsmanship, and modern minimalism.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** SQLite with Prisma
- **Auth:** Session-based admin authentication

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Database Setup

```bash
npx prisma db push
npx prisma db seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin Access

- **URL:** `/admin`
- **Default login:** admin@luxureakashmir.com / admin123

**Change the default password in production.**

## Features

- ✅ Product listing & detail pages
- ✅ Add to cart & wishlist
- ✅ Cash on Delivery (COD) checkout
- ✅ Order management (admin)
- ✅ Product management (admin)
- ✅ Editable hero, banners, policies
- ✅ Contact form
- ✅ Track order
- ✅ Responsive design

## Environment

Create `.env` with:

```
DATABASE_URL="file:./dev.db"
```

For production, use PostgreSQL and set a strong admin password.

## Build

```bash
npm run build
npm start
```
