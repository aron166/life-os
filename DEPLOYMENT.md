# Life OS — Deployment Guide

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New project
2. Name it `life-os`, choose a region close to Budapest (Frankfurt)
3. Once created, go to **SQL Editor** and paste the entire contents of `supabase/schema.sql`
4. Run it — this creates all tables and RLS policies
5. Go to **Settings → API** and copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

## 2. Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id  # optional, for calendar
```

## 3. Google Calendar Integration (optional)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → Enable **Google Calendar API**
3. **Credentials → Create OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorised JavaScript origins: `https://your-vercel-domain.vercel.app`
   - Authorised redirect URIs: `https://your-vercel-domain.vercel.app/gcal-callback`
4. Copy the Client ID → `VITE_GOOGLE_CLIENT_ID`

## 4. PWA Icons

Add your icons to `public/icons/`:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

See `public/icons/README.txt` for generator links.

## 5. Local Development

```bash
cd life-os
npm install
npm run dev
```

Open `http://localhost:5173`

## 6. Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel --prod
```
When prompted for environment variables, paste your Supabase URL and anon key.

### Option B — Vercel Dashboard
1. Push the `life-os` folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. **Framework preset**: Vite
4. **Root directory**: `life-os` (if repo contains the whole LifeOS folder)
5. **Environment variables**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
6. Deploy

Vercel auto-deploys on every push to `main`.

## 7. PWA — Add to Home Screen

On iPhone (Safari):
- Open the deployed URL → Share → Add to Home Screen

On Android (Chrome):
- The browser will prompt automatically after a few visits, or use the install banner

## 8. Auth — Email Confirmation

By default, Supabase requires email confirmation. For personal use, disable it:
- Supabase Dashboard → **Authentication → Settings**
- Toggle off **"Enable email confirmations"**

## Architecture Overview

```
src/
├── components/
│   ├── layout/     # Sidebar (desktop), BottomNav (mobile), Layout wrapper
│   ├── ui/         # Card, Button, Callout, Modal, ProgressBar, Tag, SectionLabel
│   ├── auth/       # AuthPage (sign in / sign up)
│   ├── habits/     # HabitItem with expandable description + streak freeze
│   ├── gym/        # ExerciseRow with edit/delete + PR badge
│   ├── focus/      # FocusTimer (90/15 with Web Audio API chime)
│   ├── mood/       # MoodCheckIn (5-level energy bar)
│   └── sleep/      # SleepWidget (quick log widget for dashboard)
├── hooks/
│   ├── useAuth.js      # Supabase auth state
│   ├── useHabits.js    # Habit logs, streaks, freeze, realtime sync
│   ├── useGym.js       # Exercises, session logs, PR tracking
│   ├── useJournal.js   # Journal, tasks, day type
│   ├── useSleep.js     # Sleep logs + weekly avg
│   └── useMood.js      # Mood logs
├── pages/
│   ├── Today.jsx         # Dashboard with all widgets
│   ├── Schedule.jsx      # 4 day types + Google Calendar push
│   ├── Habits.jsx        # Full habit tracker + weekly heatmap
│   ├── Gym.jsx           # PPL log with edit/delete + PR tracking
│   ├── Nutrition.jsx     # Macros + meal tracking
│   ├── Journal.jsx       # 3-prompt journal + history
│   ├── Focus.jsx         # Focus rules + built-in 90/15 timer
│   ├── School.jsx        # Sprint tracker + kanban + submissions
│   ├── Business.jsx      # Clients + pipeline + revenue tracker
│   ├── WeeklyReview.jsx  # Sunday review with habit heatmap + mood chart
│   └── Sleep.jsx         # Sleep logger + weekly chart
└── lib/
    ├── supabase.js    # Supabase client
    ├── constants.js   # All static data (habits, schedules, exercises)
    └── dateUtils.js   # Date helpers
```

## Features Checklist

- [x] Dark theme — exact #0a0a0a bg, #e8d5a0 gold accent
- [x] DM Sans + Syne + DM Mono fonts
- [x] Mobile-first responsive (sidebar desktop / bottom nav mobile)
- [x] PWA — manifest, service worker, offline support, installable
- [x] Supabase auth (email/password)
- [x] Real-time habit sync across devices
- [x] Habit descriptions with expandable info icon
- [x] Streak tracking per habit
- [x] Streak freeze (1 per week)
- [x] Mood check-in (5-level energy bar, logged daily)
- [x] Focus timer (90/15, audio chime on switch, block counter)
- [x] Sleep tracker (bedtime + wake time, avg, warning under 7h)
- [x] Gym log — editable exercises, PR badge when new record
- [x] School page — sprint info, kanban, PR/submission log
- [x] Business page — clients, prospect pipeline, revenue tracker
- [x] Weekly review — habit heatmap, mood chart, 3 journal questions
- [x] Google Calendar push (requires OAuth client ID)
- [x] Vercel deployment config
