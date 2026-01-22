# Container Planning Demo - Setup Guide

## Quick Setup (15 minutes)

### 1. Create New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free tier)
3. Copy the URL and anon key from Settings → API

### 2. Run Database Setup
In Supabase SQL Editor, run the SQL files in order:
1. `sql/01_create_tables.sql` - Creates all tables
2. `sql/02_demo_data.sql` - Adds sanitized demo data

### 3. Environment Variables
Create `.env` file:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Deploy to Vercel
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

## Features Demonstrated
- Container loading management system
- Real-time Supabase integration
- Excel import/export with styling
- Color-coded arrival status tracking
- Dark theme UI with Ant Design
- TypeScript + React + Vite

## Tech Stack
- React 18 + TypeScript
- Supabase (PostgreSQL + Real-time)
- Ant Design + Tailwind CSS
- Refine.dev framework
- xlsx-js-style for Excel
- Vite build system
