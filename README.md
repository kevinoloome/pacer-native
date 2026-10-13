# Pacer (native)

The real, native version of Pacer, built with **React Native + Expo**. This is a **separate codebase** from `pacer-app` (the Next.js web project): same brand, same Supabase database, different platform. Build this one first; the website picks back up later.

**Status:** Discover screen only, swiping real runs from the same Supabase `runs` table the web app reads from. Matches and Profile are stubbed tabs so the navigation shape is in place; neither is wired up yet.

---

## Why Expo

Expo is the toolchain, not a different language, it's still plain React Native. It gets you:

- **Live preview on your own phone** in minutes, via the free **Expo Go** app, no Xcode or Android Studio needed to get started
- A **real installable `.apk`** later, built in the cloud for free through **EAS Build**, when you're ready to put it on a device outside Expo Go
- The same React/JS you're already using in `pacer-app`, so nothing here is a new language to learn

---

## Before you start

- Node.js installed (`node -v` should print a version)
- The free **Expo Go** app on your phone, from the App Store or Play Store
- Your phone and computer on the **same Wi-Fi network**
- The same Supabase project `pacer-app` already uses (this app reads from the same `runs` table), see `pacer-github-supabase-setup.pdf` if you haven't set that up yet

---

## Run it

```bash
cd pacer-native
npm install
cp .env.example .env
```

Open `.env` and fill in your real Supabase values (same two values from `pacer-app/.env.local`, Supabase dashboard -> Settings -> API):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Then:

```bash
npx expo start
```

A QR code appears in the terminal.

- **iPhone**: open the Camera app, point it at the QR code, tap the notification
- **Android**: open Expo Go, tap "Scan QR code"

The app loads on your phone. Changes you make to the code show up live, no rebuild needed, that's what Expo Go is for.

---

## Project structure

```
app/                      Screens and navigation (Expo Router, file-based)
  _layout.js               Root layout, loads fonts, wraps the app
  (tabs)/_layout.js         Bottom tab bar (Discover / Matches / Profile)
  (tabs)/index.js           Discover screen (the swipe deck)
  (tabs)/matches.js         Placeholder
  (tabs)/profile.js         Placeholder

src/
  components/
    DiscoverDeck.jsx        Swipe deck logic (fetch, filter, drag-to-swipe)
    RunCard.jsx              A single run card
    TopBar.jsx                Header (wordmark, location pill, bell)
    PlaceholderScreen.jsx    Shared "not built yet" screen
  theme/
    colors.js                Brand color tokens (kept in sync with pacer-app's globals.css by hand)
    fonts.js                  Font family names registered in app/_layout.js
  lib/
    supabaseClient.js        Supabase client (AsyncStorage-backed session)
    runs.js                   fetchRuns() + snake_case -> camelCase mapping
    pace.js                    matchBadge() / formatPace(), identical to the web app's
    mockData.js                Default pace range (no accounts yet, so nothing to read a real one from)
```

Every file above is a deliberate native port of the matching file in `pacer-app/src/`, written to behave the same way, not translated line by line. The two codebases share nothing at the code level (no shared package), they're kept in sync by hand, by design, since native and web need genuinely different implementations for things like the swipe gesture and font loading.

---

## Design system

Same tokens as the web app and the logo, ported into `src/theme/colors.js` and `src/theme/fonts.js`:

| Token | Value |
|---|---|
| Background | `#12181D` |
| Elevated surface | `#1B232B` / `#222C35` |
| Text | `#F3F1E9` |
| Muted text | `#8B96A3` |
| Accent (hi-vis) | `#D6FF3F` |
| Accent warm | `#FF6B4A` |
| Accent blue | `#6FB7FF` |
| Line/border | `#2A333C` |

Fonts: **Space Grotesk** (display/headings), **Inter** (body), **IBM Plex Mono** (pace/numeric data), loaded via `@expo-google-fonts` packages, the native equivalent of the web app's `next/font/google`.

---

## What's built so far

- Discover screen: swipeable run cards, drag-to-swipe (left to pass, right to join), pace-match filter toggle, loading/error/empty states
- Real data: runs come live from Supabase, the same table `pacer-app` reads from
- Bottom tab navigation shell (Discover / Matches / Profile)

## What's still missing

Everything past Discover. In rough build order:

1. **Accounts** (Supabase Auth), there's no login yet, so there's no real "you" to have a pace range, a profile, or a joined-runs list
2. **Post a Run** screen
3. **Matches**: chat, joined runs, hosted runs
4. **Profile**: pace range, photos, verification, safety centre (emergency contact, live-location toggle, start/finish alert)
5. **Join/leave a run** actually writing to Supabase (right now swiping just advances the local deck, it doesn't persist a join yet)
6. Push notifications, photo moderation, Mapbox-based real location, the rest of the "should/could have" list from `pacer-requirements-and-timeline.pdf`

---

## Getting a real `.apk` (later, once you want it on a device without Expo Go)

This isn't needed for day-to-day development, Expo Go covers that, but when you're ready to install the app directly on an Android phone:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

EAS builds it in the cloud and gives you a link to download a real `.apk` when it's done, free tier covers this at low volume. The equivalent for iOS (`--platform ios`) produces a build installable via TestFlight, a paid Apple Developer account ($99/year) is required for that specifically, Android has no equivalent cost.

---

## Troubleshooting

**Expo Go shows a blank screen or an error about Supabase**
Check `.env` has both values filled in correctly, then restart with `npx expo start -c` (the `-c` clears the bundler cache, needed after changing `.env`).

**Phone can't connect / QR code doesn't load the app**
Confirm your phone and computer are on the same Wi-Fi network. If they're on a network that blocks device-to-device traffic (common on some office/public Wi-Fi), run `npx expo start --tunnel` instead, slower, but works around that.

**"Couldn't load runs" inside the app**
Same cause as the web app: wrong or missing Supabase URL/key in `.env`, or the `runs` table doesn't exist yet. Run `pacer-app/supabase/schema.sql` in the Supabase SQL editor if you haven't already, both apps read from that same table.
