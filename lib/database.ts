import * as SQLite from 'expo-sqlite';

export type SettingKey = 'email' | 'reminderMorning' | 'reminderEvening' | 'graceMode';

const db = SQLite.openDatabaseSync('life-tracker.db');

export type Pillar = { id: number; name: string };
export type Habit = { id: number; name: string; pillarId: number; pillarName: string };
export type RecurringEvent = {
  id: number;
  title: string;
  weekday: number;
  category: string;
  time: string | null;
  notes: string | null;
};
export type JournalEntry = { id: number; date: string; content: string; tags: string | null };
export type Project3D = {
  id: number;
  name: string;
  archetype: string | null;
  stage: string | null;
  notes: string | null;
  nextActions: string | null;
};
export type PrintLog = { id: number; projectId: number; date: string; details: string };

const defaultPillars = ['Spiritual', 'Marriage', 'Health', '3D', 'Music'];

const habitSeeds = [
  { name: 'Prayer + Bible reading', pillar: 'Spiritual' },
  { name: 'Encouraging check-in', pillar: 'Marriage' },
  { name: 'Workout or walk', pillar: 'Health' },
  { name: '3D character progress', pillar: '3D' },
  { name: 'Music practice', pillar: 'Music' },
];

const recurringSeeds = [
  { title: 'Family worship', weekday: 2, category: 'Weekly Anchor', time: '19:00' },
  { title: 'Meeting', weekday: 3, category: 'Weekly Anchor', time: '19:30' },
  { title: 'Letter writing', weekday: 4, category: 'Weekly Anchor', time: '18:00' },
  { title: 'Date night', weekday: 5, category: 'Weekly Anchor', time: '19:00' },
  { title: 'Field service', weekday: 6, category: 'Weekly Anchor', time: '10:00' },
  { title: 'Meeting', weekday: 0, category: 'Weekly Anchor', time: '10:00' },
  { title: 'Mon sculpt', weekday: 1, category: 'Creative Block', time: '20:00' },
  { title: 'Thu review', weekday: 4, category: 'Creative Block', time: '20:00' },
  { title: 'Sat artist date', weekday: 6, category: 'Creative Block', time: '14:00' },
  { title: 'Sun music (optional)', weekday: 0, category: 'Creative Block', time: '16:00' },
];

export function getIsoDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

export function initializeDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS Pillars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS Habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      pillarId INTEGER NOT NULL,
      UNIQUE(name, pillarId),
      FOREIGN KEY (pillarId) REFERENCES Pillars(id)
    );
    CREATE TABLE IF NOT EXISTS RecurringEvents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      weekday INTEGER NOT NULL,
      category TEXT NOT NULL,
      time TEXT,
      notes TEXT,
      UNIQUE(title, weekday, category)
    );
    CREATE TABLE IF NOT EXISTS HabitCompletions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitId INTEGER NOT NULL,
      date TEXT NOT NULL,
      level TEXT NOT NULL CHECK(level IN ('minimum','standard')),
      UNIQUE(habitId, date, level),
      FOREIGN KEY (habitId) REFERENCES Habits(id)
    );
    CREATE TABLE IF NOT EXISTS JournalEntries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT
    );
    CREATE TABLE IF NOT EXISTS Projects3D (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      archetype TEXT,
      stage TEXT,
      notes TEXT,
      nextActions TEXT
    );
    CREATE TABLE IF NOT EXISTS PrintLogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      date TEXT NOT NULL,
      details TEXT NOT NULL,
      FOREIGN KEY (projectId) REFERENCES Projects3D(id)
    );
    CREATE TABLE IF NOT EXISTS AppSettings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  defaultPillars.forEach((name) => {
    db.runSync('INSERT OR IGNORE INTO Pillars (name) VALUES (?)', name);
  });

  habitSeeds.forEach(({ name, pillar }) => {
    db.runSync(
      'INSERT OR IGNORE INTO Habits (name, pillarId) SELECT ?, id FROM Pillars WHERE name = ?',
      name,
      pillar
    );
  });

  recurringSeeds.forEach(({ title, weekday, category, time }) => {
    db.runSync(
      'INSERT OR IGNORE INTO RecurringEvents (title, weekday, category, time) VALUES (?, ?, ?, ?)',
      title,
      weekday,
      category,
      time
    );
  });

  db.runSync("INSERT OR IGNORE INTO AppSettings (key, value) VALUES ('graceMode', '1')");
  db.runSync("INSERT OR IGNORE INTO AppSettings (key, value) VALUES ('email', '')");
  db.runSync("INSERT OR IGNORE INTO AppSettings (key, value) VALUES ('reminderMorning', '07:00')");
  db.runSync("INSERT OR IGNORE INTO AppSettings (key, value) VALUES ('reminderEvening', '20:30')");
}

export function getHabits() {
  return db.getAllSync<Habit>(
    `SELECT Habits.id, Habits.name, Habits.pillarId, Pillars.name AS pillarName
     FROM Habits
     JOIN Pillars ON Habits.pillarId = Pillars.id
     ORDER BY Pillars.name, Habits.name`
  );
}

export function getRecurringEvents(weekday?: number) {
  if (typeof weekday === 'number') {
    return db.getAllSync<RecurringEvent>(
      'SELECT * FROM RecurringEvents WHERE weekday = ? ORDER BY category, time',
      weekday
    );
  }

  return db.getAllSync<RecurringEvent>('SELECT * FROM RecurringEvents ORDER BY weekday, category, time');
}

export function logHabit(habitId: number, date: string, level: 'minimum' | 'standard') {
  db.runSync('INSERT OR IGNORE INTO HabitCompletions (habitId, date, level) VALUES (?, ?, ?)', habitId, date, level);
}

export function removeHabitLog(habitId: number, date: string, level: 'minimum' | 'standard') {
  db.runSync('DELETE FROM HabitCompletions WHERE habitId = ? AND date = ? AND level = ?', habitId, date, level);
}

export function getHabitCompletionsForDate(date: string) {
  return db.getAllSync<{ habitId: number; level: 'minimum' | 'standard' }>(
    'SELECT habitId, level FROM HabitCompletions WHERE date = ?',
    date
  );
}

export function addJournalEntry(content: string, tags: string) {
  db.runSync('INSERT INTO JournalEntries (date, content, tags) VALUES (?, ?, ?)', getIsoDate(), content, tags);
}

export function getJournalEntries(search = '') {
  if (!search.trim()) {
    return db.getAllSync<JournalEntry>('SELECT * FROM JournalEntries ORDER BY date DESC, id DESC');
  }

  return db.getAllSync<JournalEntry>(
    'SELECT * FROM JournalEntries WHERE content LIKE ? OR tags LIKE ? ORDER BY date DESC, id DESC',
    `%${search}%`,
    `%${search}%`
  );
}

export function getProjects() {
  return db.getAllSync<Project3D>('SELECT * FROM Projects3D ORDER BY id DESC');
}

export function addProject(project: Omit<Project3D, 'id'>) {
  db.runSync(
    'INSERT INTO Projects3D (name, archetype, stage, notes, nextActions) VALUES (?, ?, ?, ?, ?)',
    project.name,
    project.archetype,
    project.stage,
    project.notes,
    project.nextActions
  );
}

export function getPrintLogs() {
  return db.getAllSync<PrintLog>('SELECT * FROM PrintLogs ORDER BY date DESC, id DESC');
}

export function addPrintLog(projectId: number, details: string) {
  db.runSync('INSERT INTO PrintLogs (projectId, date, details) VALUES (?, ?, ?)', projectId, getIsoDate(), details);
}

export function getSetting(key: SettingKey) {
  return db.getFirstSync<{ value: string }>('SELECT value FROM AppSettings WHERE key = ?', key)?.value ?? '';
}

export function setSetting(key: SettingKey, value: string) {
  db.runSync(
    'INSERT INTO AppSettings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    value
  );
}

export function calculateStreak(habitId: number, graceMode: boolean) {
  const today = new Date();
  let streak = 0;
  let misses = 0;

  for (let i = 0; i < 120; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const day = getIsoDate(date);
    const logged = db.getFirstSync<{ count: number }>(
      "SELECT COUNT(*) as count FROM HabitCompletions WHERE habitId = ? AND date = ? AND level IN ('minimum','standard')",
      habitId,
      day
    )?.count;

    if ((logged ?? 0) > 0) {
      streak += 1;
      misses = 0;
      continue;
    }

    misses += 1;
    if (!graceMode || misses >= 2) {
      break;
    }
    streak += 1;
  }

  return streak;
}
