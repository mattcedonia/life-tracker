import type { SQLiteDatabase } from 'expo-sqlite';

export type HabitLogStatus = 'done' | 'grace' | 'miss';

export type MinimumWin = { id: number; title: string; doneToday: number };
export type Anchor = { id: number; title: string; weekday: number };
export type Habit = { id: number; name: string; streak: number; graceLeft: number; todayStatus: HabitLogStatus | null };
export type JournalEntry = { entryDate: string; content: string };
export type Project = { id: number; title: string; pillar: string; summary: string; printCount: number };
export type PrintLog = { id: number; projectId: number; createdAt: string; notes: string };

export const todayKey = () => new Date().toISOString().slice(0, 10);

const seedPillars = ['Health', 'Career', 'Relationships', 'Creativity'];
const seedAnchors: Array<{ title: string; weekday: number }> = [
  { title: 'Monday planning sprint', weekday: 1 },
  { title: 'Wednesday progress checkpoint', weekday: 3 },
  { title: 'Friday weekly review', weekday: 5 },
  { title: 'Sunday reset routine', weekday: 0 },
];
const seedWins = ['Hydrate', 'Move for 20 minutes', 'Deep work block'];
const seedHabits = ['Sleep before 11pm', 'No-scroll morning', 'Read 10 pages'];
const seedProjects = [
  { title: 'Desk organizer', pillar: 'Creativity', summary: 'Modular tray system for cables + tools.' },
  { title: 'Phone stand', pillar: 'Health', summary: 'Ergonomic angled stand for focus sessions.' },
];

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS pillars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS anchors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      weekday INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS minimum_wins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS win_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      win_id INTEGER NOT NULL,
      entry_date TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      UNIQUE(win_id, entry_date)
    );
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      streak INTEGER NOT NULL DEFAULT 0,
      grace_left INTEGER NOT NULL DEFAULT 2
    );
    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      entry_date TEXT NOT NULL,
      status TEXT NOT NULL,
      UNIQUE(habit_id, entry_date)
    );
    CREATE TABLE IF NOT EXISTS journal_entries (
      entry_date TEXT PRIMARY KEY,
      content TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      pillar TEXT NOT NULL,
      summary TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS print_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      notes TEXT NOT NULL
    );
  `);

  const pillarCount = await getCount(db, 'pillars');
  if (!pillarCount) {
    for (const name of seedPillars) {
      await db.runAsync('INSERT INTO pillars (name) VALUES (?)', name);
    }
  }

  const anchorCount = await getCount(db, 'anchors');
  if (!anchorCount) {
    for (const anchor of seedAnchors) {
      await db.runAsync('INSERT INTO anchors (title, weekday) VALUES (?, ?)', anchor.title, anchor.weekday);
    }
  }

  const winCount = await getCount(db, 'minimum_wins');
  if (!winCount) {
    for (const win of seedWins) {
      await db.runAsync('INSERT INTO minimum_wins (title) VALUES (?)', win);
    }
  }

  const habitCount = await getCount(db, 'habits');
  if (!habitCount) {
    for (const habit of seedHabits) {
      await db.runAsync('INSERT INTO habits (name) VALUES (?)', habit);
    }
  }

  const projectCount = await getCount(db, 'projects');
  if (!projectCount) {
    for (const project of seedProjects) {
      await db.runAsync(
        'INSERT INTO projects (title, pillar, summary) VALUES (?, ?, ?)',
        project.title,
        project.pillar,
        project.summary
      );
    }
  }
}

async function getCount(db: SQLiteDatabase, tableName: string) {
  const row = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM ${tableName}`);
  return row?.count ?? 0;
}

export async function getTodayWins(db: SQLiteDatabase): Promise<MinimumWin[]> {
  const date = todayKey();
  return db.getAllAsync<MinimumWin>(
    `SELECT w.id, w.title, COALESCE(l.done, 0) as doneToday
     FROM minimum_wins w
     LEFT JOIN win_logs l ON l.win_id = w.id AND l.entry_date = ?
     ORDER BY w.id`,
    date
  );
}

export async function toggleWin(db: SQLiteDatabase, winId: number, done: number) {
  const date = todayKey();
  await db.runAsync(
    `INSERT INTO win_logs (win_id, entry_date, done)
     VALUES (?, ?, ?)
     ON CONFLICT(win_id, entry_date) DO UPDATE SET done = excluded.done`,
    winId,
    date,
    done
  );
}

export async function getAnchors(db: SQLiteDatabase) {
  return db.getAllAsync<Anchor>('SELECT id, title, weekday FROM anchors ORDER BY weekday, id');
}

export async function getHabits(db: SQLiteDatabase): Promise<Habit[]> {
  const date = todayKey();
  return db.getAllAsync<Habit>(
    `SELECT h.id, h.name, h.streak, h.grace_left as graceLeft,
      (SELECT status FROM habit_logs WHERE habit_id = h.id AND entry_date = ?) as todayStatus
     FROM habits h
     ORDER BY h.id`,
    date
  );
}

export async function setHabitStatus(db: SQLiteDatabase, habitId: number, status: HabitLogStatus) {
  const date = todayKey();
  await db.runAsync(
    `INSERT INTO habit_logs (habit_id, entry_date, status)
     VALUES (?, ?, ?)
     ON CONFLICT(habit_id, entry_date) DO UPDATE SET status = excluded.status`,
    habitId,
    date,
    status
  );
  await recalculateHabitStats(db, habitId);
}

async function recalculateHabitStats(db: SQLiteDatabase, habitId: number) {
  const logs = await db.getAllAsync<{ entry_date: string; status: HabitLogStatus }>(
    'SELECT entry_date, status FROM habit_logs WHERE habit_id = ? ORDER BY entry_date DESC',
    habitId
  );

  let streak = 0;
  for (const log of logs) {
    if (log.status === 'done' || log.status === 'grace') {
      streak += 1;
      continue;
    }
    break;
  }

  const thisWeekStart = getWeekStart();
  const graceUsedRow = await db.getFirstAsync<{ used: number }>(
    'SELECT COUNT(*) as used FROM habit_logs WHERE habit_id = ? AND status = ? AND entry_date >= ?',
    habitId,
    'grace',
    thisWeekStart
  );
  const graceLeft = Math.max(0, 2 - (graceUsedRow?.used ?? 0));

  await db.runAsync('UPDATE habits SET streak = ?, grace_left = ? WHERE id = ?', streak, graceLeft, habitId);
}

function getWeekStart() {
  const now = new Date();
  const start = new Date(now);
  const day = now.getDay();
  start.setDate(now.getDate() - day);
  return start.toISOString().slice(0, 10);
}

export async function getJournalEntry(db: SQLiteDatabase): Promise<JournalEntry> {
  const date = todayKey();
  const entry = await db.getFirstAsync<JournalEntry>(
    'SELECT entry_date as entryDate, content FROM journal_entries WHERE entry_date = ?',
    date
  );
  return entry ?? { entryDate: date, content: '' };
}

export async function saveJournalEntry(db: SQLiteDatabase, content: string) {
  const date = todayKey();
  await db.runAsync(
    `INSERT INTO journal_entries (entry_date, content)
     VALUES (?, ?)
     ON CONFLICT(entry_date) DO UPDATE SET content = excluded.content`,
    date,
    content
  );
}

export async function getProjects(db: SQLiteDatabase) {
  return db.getAllAsync<Project>(
    `SELECT p.id, p.title, p.pillar, p.summary, COALESCE(COUNT(l.id), 0) as printCount
     FROM projects p
     LEFT JOIN print_logs l ON l.project_id = p.id
     GROUP BY p.id
     ORDER BY p.id`
  );
}

export async function addPrintLog(db: SQLiteDatabase, projectId: number, notes: string) {
  await db.runAsync('INSERT INTO print_logs (project_id, created_at, notes) VALUES (?, ?, ?)', projectId, new Date().toISOString(), notes);
}

export async function getPrintLogs(db: SQLiteDatabase, projectId: number) {
  return db.getAllAsync<PrintLog>(
    'SELECT id, project_id as projectId, created_at as createdAt, notes FROM print_logs WHERE project_id = ? ORDER BY created_at DESC',
    projectId
  );
}


export async function getPillars(db: SQLiteDatabase) {
  return db.getAllAsync<{ id: number; name: string }>('SELECT id, name FROM pillars ORDER BY id');
}

export async function resetTrackerData(db: SQLiteDatabase) {
  await db.execAsync(`
    DELETE FROM win_logs;
    DELETE FROM habit_logs;
    DELETE FROM journal_entries;
    DELETE FROM print_logs;
  `);
  await db.runAsync('UPDATE habits SET streak = 0, grace_left = 2');
}
