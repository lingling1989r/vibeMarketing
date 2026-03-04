// Weekly planning CLI — shows this week's content tasks
// Usage: node weekly.js [--all] [--channel twitter] [--status planned]

import dayjs from 'dayjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const cal = JSON.parse(readFileSync(join(__dir, 'calendar.json'), 'utf-8'));

const args = process.argv.slice(2);
const showAll = args.includes('--all');
const filterChannel = args.find(a => a.startsWith('--channel='))?.split('=')[1];
const filterStatus  = args.find(a => a.startsWith('--status='))?.split('=')[1];

const today   = dayjs();
const launch  = dayjs(cal.launchDate);
const daysToLaunch = launch.diff(today, 'day');

const STATUS_COLOR = {
  planned:   '\x1b[33m',   // yellow
  drafting:  '\x1b[36m',   // cyan
  ready:     '\x1b[32m',   // green
  published: '\x1b[90m',   // grey
};
const RESET = '\x1b[0m';
const BOLD  = '\x1b[1m';

console.log(`\n${BOLD}📅 PodAha Content Calendar${RESET}`);
console.log(`Launch date: ${cal.launchDate} — ${daysToLaunch > 0 ? `T-${daysToLaunch} days` : daysToLaunch === 0 ? '🚀 TODAY!' : `${Math.abs(daysToLaunch)}d after launch`}\n`);

// Summary
const allTasks = cal.slots.flatMap(s => s.tasks);
const counts   = { planned: 0, drafting: 0, ready: 0, published: 0 };
allTasks.forEach(t => counts[t.status]++);
console.log(`Total tasks: ${allTasks.length} | ` +
  `🟡 planned: ${counts.planned} | ` +
  `🔵 drafting: ${counts.drafting} | ` +
  `🟢 ready: ${counts.ready} | ` +
  `⚫ published: ${counts.published}\n`);

// Filter: show upcoming 7 days by default, or all
const weekAhead = today.add(8, 'day');
const slots = cal.slots.filter(s => {
  const d = dayjs(s.date);
  if (showAll) return true;
  return d.isAfter(today.subtract(1, 'day')) && d.isBefore(weekAhead);
});

if (slots.length === 0) {
  console.log('No tasks in the next 7 days. Run with --all to see everything.\n');
  process.exit(0);
}

for (const slot of slots) {
  const slotDate = dayjs(slot.date);
  const isToday  = slotDate.isSame(today, 'day');
  const label    = isToday ? ' ← TODAY' : '';

  console.log(`${BOLD}${slot.date} [${slot.week}] — ${slot.theme}${label}${RESET}`);

  const tasks = slot.tasks.filter(t => {
    if (filterChannel && t.channel !== filterChannel) return false;
    if (filterStatus  && t.status  !== filterStatus)  return false;
    return true;
  });

  if (tasks.length === 0) {
    console.log('  (no tasks match filter)\n');
    continue;
  }

  for (const task of tasks) {
    const color = STATUS_COLOR[task.status] || '';
    const icon  = { planned: '🟡', drafting: '🔵', ready: '🟢', published: '⚫' }[task.status] || '•';
    console.log(`  ${icon} ${color}[${task.status.toUpperCase()}]${RESET} ${task.channel.padEnd(10)} ${task.lang} | ${task.topic}`);
    if (task.notes) console.log(`     💡 ${task.notes}`);
  }
  console.log('');
}

console.log(`Run with ${BOLD}--all${RESET} to see full calendar`);
console.log(`Filter: ${BOLD}--channel=twitter${RESET}  ${BOLD}--status=planned${RESET}\n`);
