# VaultMind — Secure Account Manager

A modern, full-featured CRUD-based account credential manager built with React, Vite, Tailwind CSS, and Supabase. Deployable 100% free on Netlify.

---

## Features

- **Secure Authentication** — Single admin account via Supabase Auth (bcrypt under the hood), email-restricted login
- **Account CRUD** — Create, view, update, and delete stored credentials
- **AES-256 Encryption** — All stored passwords are encrypted before hitting the database
- **Real-time Search** — Filter accounts by platform, email, username, or notes
- **Calendar & Scheduling** — Full month/week/day calendar powered by FullCalendar
- **Event Reminders** — Browser push notifications at event time and 3 hours before
- **Password Generator** — Built-in strong password generator with strength meter
- **Dark UI** — Modern glassmorphism design with responsive layout
- **SweetAlert2 Modals** — Beautiful feedback for all CRUD actions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend/DB | Supabase (PostgreSQL + Auth) |
| Calendar | FullCalendar v6 |
| Notifications | SweetAlert2 + Browser Notification API |
| Encryption | CryptoJS (AES-256) |
| Deployment | Netlify |

---

## Setup Guide

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd account-manager
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
4. Go to **Settings → API** and copy:
   - Project URL (`VITE_SUPABASE_URL`)
   - Anon/public key (`VITE_SUPABASE_ANON_KEY`)

### 3. Create the Admin Account

1. In Supabase dashboard → **Authentication → Users**
2. Click **Add User → Create new user**
3. Enter your admin email and a strong password
4. **Important:** Go to **Authentication → Settings** and disable **Enable email confirmations** (or confirm via the email)
5. Also disable **Enable Sign Ups** to prevent anyone else from registering

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Must match the email you created in Supabase Auth
VITE_ADMIN_EMAIL=admin@example.com

# Strong random key for encrypting stored passwords (32+ characters)
# Generate one: openssl rand -base64 32
VITE_ENCRYPTION_KEY=your-super-secret-32-char-encryption-key-here
```

> ⚠️ **Security Note:** `VITE_ENCRYPTION_KEY` is used to encrypt/decrypt stored passwords. Keep it secret and never change it after you've saved accounts — changing it will make existing passwords unreadable.

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and log in with your admin credentials.

---

## Deploy to Netlify

### Option A: Netlify UI

1. Push your code to GitHub/GitLab
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Select your repository
4. Build settings are auto-detected from `netlify.toml`
5. Go to **Site settings → Environment variables** and add all your `.env` values
6. Deploy!

### Option B: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set VITE_SUPABASE_URL "https://..."
netlify env:set VITE_SUPABASE_ANON_KEY "..."
netlify env:set VITE_ADMIN_EMAIL "admin@example.com"
netlify env:set VITE_ENCRYPTION_KEY "your-key"
netlify deploy --prod
```

---

## Project Structure

```
account-manager/
├── public/
│   └── sw.js                     # Service worker for push notifications
├── src/
│   ├── components/
│   │   ├── accounts/             # AccountsTable, AccountForm, PasswordDisplay
│   │   ├── calendar/             # CalendarView, EventForm
│   │   ├── layout/               # Layout, Sidebar, Header
│   │   ├── settings/             # ChangePasswordForm
│   │   └── ui/                   # Modal, SearchBar
│   ├── contexts/
│   │   └── AuthContext.jsx       # Auth state + login/logout/changePassword
│   ├── hooks/
│   │   ├── useAccounts.js        # Account CRUD + encryption
│   │   └── useSchedules.js       # Calendar event CRUD
│   ├── lib/
│   │   ├── supabase.js           # Supabase client
│   │   ├── encryption.js         # AES-256 encrypt/decrypt
│   │   └── notifications.js      # SweetAlert2 + browser notifications
│   └── pages/
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── Calendar.jsx
│       └── Settings.jsx
├── supabase/
│   └── schema.sql                # Database schema + RLS policies
├── .env.example
├── netlify.toml
└── vite.config.js
```

---

## Security Architecture

| Concern | Implementation |
|---|---|
| Admin auth | Supabase Auth with bcrypt (PBKDF2 internally) |
| Email restriction | `VITE_ADMIN_EMAIL` checked before Supabase login |
| Session management | JWT via Supabase, stored in localStorage |
| Password storage | AES-256 via CryptoJS, key from env var |
| Database access | Row Level Security — only authenticated users |
| HTTPS | Enforced by Netlify |

---

## Notifications

### Browser Notifications (Built-in)
When you click **Enable Reminders** on the Calendar page, the browser will request notification permission. If granted:
- You'll be notified **at the event time**
- You'll be notified **3 hours before** the event

These work while the browser tab is open. The service worker (`public/sw.js`) is registered for future Web Push integration.

### Google Calendar (Optional Enhancement)
To sync events to Google Calendar, you can add the [Google Calendar API](https://developers.google.com/calendar) integration using your `VITE_GOOGLE_CLIENT_ID` env variable.

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## License

MIT — free for personal and commercial use.
