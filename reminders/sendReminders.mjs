import fs from "fs";
import path from "path";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const SENDGRID_FROM_NAME = process.env.SENDGRID_FROM_NAME || "Life Tracker";

if (!SENDGRID_API_KEY) throw new Error("Missing SENDGRID_API_KEY");
if (!SENDGRID_FROM_EMAIL) throw new Error("Missing SENDGRID_FROM_EMAIL");

const remindersPath = path.join(process.cwd(), "reminders", "reminders.json");
const cfg = JSON.parse(fs.readFileSync(remindersPath, "utf8"));

function nowInTimeZone(tz) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const parts = dtf.formatToParts(new Date());
  const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return {
    yyyy: map.year,
    mm: map.month,
    dd: map.day,
    HH: map.hour,
    MM: map.minute
  };
}

function minutesSinceMidnight(HH, MM) {
  return Number(HH) * 60 + Number(MM);
}

function parseTime24h(s) {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

function withinWindow(nowMin, targetMin, windowMin) {
  return Math.abs(nowMin - targetMin) <= windowMin;
}

function todayKey(tz) {
  const t = nowInTimeZone(tz);
  return `${t.yyyy}-${t.mm}-${t.dd}`;
}

async function sendEmail({ to, subject, text }) {
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: SENDGRID_FROM_EMAIL, name: SENDGRID_FROM_NAME },
      subject,
      content: [{ type: "text/plain", value: text }]
    })
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SendGrid error ${res.status}: ${body}`);
  }
}

async function main() {
  const tz = cfg.timezone || "America/New_York";
  const windowMin = Number(cfg.windowsMinutes ?? 6);

  const now = nowInTimeZone(tz);
  const nowMin = minutesSinceMidnight(now.HH, now.MM);
  const dateKey = todayKey(tz);

  const eligible = cfg.slots.filter(slot => {
    const targetMin = parseTime24h(slot.time24h);
    return withinWindow(nowMin, targetMin, windowMin);
  });

  if (eligible.length === 0) {
    console.log("No reminder window right now.");
    return;
  }

  for (const slot of eligible) {
    const subject = `${slot.subject} (${dateKey})`;
    const text = slot.lines.join("\n");
    await sendEmail({
      to: cfg.defaultRecipient,
      subject,
      text
    });
    console.log(`Sent: ${slot.id}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
