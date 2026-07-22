# Snowscape

A ski conditions web app for Pacific Northwest resorts.

## Stack
- Next.js 16, App Router, no TypeScript
- Tailwind CSS
- Supabase (PostgreSQL) — resort data
- Open-Meteo API — live weather, no API key needed
- Vercel hosting, auto-deploys from GitHub
- Custom domain: snowscape.info

## Supabase
- Table: `resorts` — columns: id, name, state, summit_elevation, latitude, longitude
- Client: `src/lib/supabase.js`

## Weather
- Helper: `src/lib/weather.js`
- Returns: temp, snowDepth, snowfall, windSpeed, dailySnow (7-day array)

## Resorts in database
Mt. Bachelor, Crystal Mountain, Mt. Hood Meadows, Timberline,
Ski Bowl, Hoodoo, Stevens Pass, Mt. Baker, Snoqualmie Pass, Whistler Blackcomb

## Design
- Dark theme: neutral-950 background, neutral-900 cards, neutral-800 borders
- Accent: emerald-600
- Rounded-2xl cards, clean layout
- Condition dot colors: emerald = depth >60", blue = >30", amber = below

## What's built
- Main dashboard at src/app/page.js — nav, sidebar resort list,
  featured resort stats, 7-day forecast, all-resorts table
- All resorts show live weather data

## What needs building (in priority order)
1. Dynamic routing — /resort/[id] so each resort has its own page
2. Clickable sidebar linking to resort pages
3. Road conditions — ODOT/WSDOT APIs
4. Conditions score — composite rating per resort
5. Liftie.info integration — lift and trail status
6. Best for Me scorer page — riding style presets + weighted sliders
7. Map view — Mapbox GL JS with resort pins
8. User accounts and saved resorts — Supabase Auth
9. Storm alerts

## Key decisions
- "Best for me" is a button in the nav, not the main screen
- Sidebar shows all resorts with color-coded condition dots and snow depth
- Each resort page should show: stats grid, 7-day forecast,
  road conditions, terrain breakdown, snow report, webcam placeholder
