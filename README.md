# Life Tracker (Expo + SQLite)

V1 iPhone-focused life tracking app built with Expo Router and `expo-sqlite`.

## V1 features

- Bottom tabs: **Today**, **Week**, **Habits**, **Journal**, **Projects (3D)**, **Settings**.
- SQLite tables:
  - `Pillars`
  - `Habits`
  - `RecurringEvents`
  - `HabitCompletions`
  - `JournalEntries`
  - `Projects3D`
  - `PrintLogs`
- Seeded defaults:
  - Pillars: Spiritual, Marriage, Health, 3D, Music
  - Weekly anchors and creative blocks
- Grace Mode streak rule:
  - 1 miss allowed
  - streak breaks after 2 consecutive misses
- Settings are stored locally only (email + reminder times).
- No push notifications and no email reminders in V1.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Expo:

   ```bash
   npm run start
   ```

3. Open in Expo Go:

   - Scan QR code from terminal
   - Ensure phone and computer are on the same network

## Helpful scripts

- `npm run ios` – open iOS simulator (if available)
- `npm run android` – open Android emulator/device
- `npm run web` – open web preview
- `npm run lint` – run Expo lint checks
