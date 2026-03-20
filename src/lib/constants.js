// ── Habits ──────────────────────────────────────────────────────────────────
export const HABITS = [
  {
    id: 'morning',
    label: 'Morning ritual complete',
    group: 'morning',
    description: 'Water immediately on wake, no phone for 30 min, breakfast before anything, 15 min solo thinking, 10 min meditation. This anchors your dopamine baseline for the day and sets the tone for everything that follows.',
  },
  {
    id: 'breakfast',
    label: 'Ate breakfast',
    group: 'morning',
    description: 'High protein breakfast within 30 min of waking (35–40g). Sets insulin sensitivity, fuels the first work block, and prevents the 11am crash. Eggs + Greek yogurt is the default.',
  },
  {
    id: 'nophone',
    label: 'No phone first 30 min',
    group: 'morning',
    description: "Your attention is the most valuable thing you own. Don't sell it to Instagram before you've even stood up. The first 30 min without external input lets your prefrontal cortex wake up on its own terms.",
  },
  {
    id: 'thinking',
    label: '15 min solo thinking',
    group: 'morning',
    description: 'Notebook, pen, no AI, no phone. Your brain owns the strategy — Claude executes. This is where the clearest ideas come from. Ask yourself: what is the one move that matters most today?',
  },
  {
    id: 'water',
    label: '500ml water on wake',
    group: 'morning',
    description: 'You wake up 1–2% dehydrated after 8 hours without water. Drinking 500ml first thing improves morning cognition within 20 minutes. This is the lowest-effort, highest-return habit on this list.',
  },
  {
    id: 'deepwork',
    label: '2 deep work blocks done',
    group: 'work',
    description: '2 × 90-min deep work blocks — the minimum viable creative output. Anything less is maintenance, not progress. Phone in another room, single task, door closed. This is your most important metric.',
  },
  {
    id: 'gym',
    label: 'Gym session',
    group: 'body',
    description: 'Training session — strength (PPL) or cardio. Physical output compounds everything else: better sleep quality, better dopamine regulation, better focus, better mood. This is non-negotiable.',
  },
  {
    id: 'reading',
    label: '10 pages reading',
    group: 'evening',
    description: '10 pages of a real book before bed. Builds your knowledge bank slowly but compoundingly. Improves focus span. Far better wind-down than any screen — your sleep architecture will thank you.',
  },
  {
    id: 'journal_h',
    label: 'Evening journal (3 sentences)',
    group: 'evening',
    description: "3 sentences: what worked, what didn't, what's the priority tomorrow. Takes 5 minutes, costs nothing, and over months builds a pattern map of your actual life. Insight without it is just guessing.",
  },
  {
    id: 'shutdown',
    label: 'Shutdown ritual done',
    group: 'evening',
    description: '3 tasks for tomorrow written, laptop physically closed, brain dump done. This ritual tells your nervous system the workday is over. Prevents the 11pm anxiety spiral where you lie awake rehashing problems.',
  },
  {
    id: 'sleep',
    label: 'Asleep before midnight',
    group: 'evening',
    description: 'Sleep is the recovery that makes everything else possible. 7+ hours is the baseline. Before midnight preserves your natural circadian rhythm and maximises deep sleep in the first half of the night.',
  },
]

export const MAIN_HABITS = ['morning','breakfast','nophone','thinking','deepwork','gym','shutdown','sleep']

// ── Habit groups ─────────────────────────────────────────────────────────────
export const HABIT_GROUPS = {
  morning: 'Morning stack',
  work:    'Work stack',
  body:    'Body stack',
  evening: 'Evening stack',
}

// ── Gym exercises ────────────────────────────────────────────────────────────
export const DEFAULT_EXERCISES = {
  push: [
    { id: 'bench',  name: 'Bench press',      default_sets: 4, default_reps: 8 },
    { id: 'ohp',    name: 'Overhead press',   default_sets: 3, default_reps: 10 },
    { id: 'fly',    name: 'Incline DB fly',   default_sets: 3, default_reps: 12 },
    { id: 'tri',    name: 'Tricep pushdown',  default_sets: 3, default_reps: 15 },
    { id: 'lat',    name: 'Lateral raise',    default_sets: 3, default_reps: 15 },
  ],
  pull: [
    { id: 'pullup', name: 'Pull-ups / Lat pulldown', default_sets: 4, default_reps: 8 },
    { id: 'row',    name: 'Barbell row',       default_sets: 3, default_reps: 10 },
    { id: 'face',   name: 'Face pulls',        default_sets: 3, default_reps: 15 },
    { id: 'ham',    name: 'Hammer curl',       default_sets: 3, default_reps: 12 },
    { id: 'curl',   name: 'Barbell curl',      default_sets: 3, default_reps: 12 },
  ],
  legs: [
    { id: 'squat',  name: 'Squat',             default_sets: 4, default_reps: 8 },
    { id: 'rdl',    name: 'Romanian deadlift', default_sets: 3, default_reps: 10 },
    { id: 'press',  name: 'Leg press',         default_sets: 3, default_reps: 12 },
    { id: 'legcurl',name: 'Leg curl',           default_sets: 3, default_reps: 12 },
    { id: 'calf',   name: 'Calf raises',       default_sets: 4, default_reps: 20 },
  ],
}

// ── Schedule blocks ──────────────────────────────────────────────────────────
export const SCHEDULES = {
  team: {
    color: 'blue',
    callout: "Team day — you're externally structured 9–3. Maximise the gaps. Don't fight the schedule.",
    calloutType: 'info',
    wins: [{ val: '1', lbl: 'Thing shipped' }, { val: '90min', lbl: 'Personal work' }, { val: '23:30', lbl: 'Lights out' }],
    blocks: [
      { time: '7:45', title: 'Wake — earlier than usual', desc: 'Hard 9am start. Set alarm 7:45. Compressed morning ritual.', tags: ['45 min ritual'] },
      { time: '8:00', title: 'Water + breakfast immediately', desc: 'High protein. No thinking, no phone. Brain fuel for 6 hours of team work.' },
      { time: '8:15', title: '15 min solo thinking', desc: "Notebook only. What's the one thing you want shipped by 3pm?", tags: ['no AI, no phone'] },
      { time: '8:40', title: 'Review sprint tasks', desc: 'Scan Notion board, know what you\'re walking into.', tags: ['AI: summarise sprint'] },
      { time: '9:00', title: 'Team block — meetings + coding', desc: 'Full presence. Between meetings: heads-down on your task, not side projects.', tags: ['9am–3pm'] },
      { time: '13:00', title: 'Lunch — step away from screen', desc: "20 min. Real food. You'll think better for the afternoon." },
      { time: '15:00', title: 'Debrief yourself — 5 min', desc: "What shipped? What's blocked? What to ask Tamás?", tags: ['5 min'] },
      { time: '15:15', title: 'Gym OR personal deep work', desc: "Gym if it's a gym day. Otherwise one 90 min block — business or personal. Not both.", tags: ['your choice'] },
      { time: '21:00', title: 'Shutdown + tomorrow prep', desc: '3 tasks written. Brain dump. Laptop closed. In bed 23:30.', tags: ['hard stop'] },
    ],
  },
  bar: {
    color: 'orange',
    callout: "Bar day is not a lost day. You have 8 usable hours before 5pm. Protect your morning brain — don't arrive drained.",
    calloutType: 'warn',
    wins: [{ val: '3hrs', lbl: 'Deep work' }, { val: '1', lbl: 'Gym (if energy)' }, { val: '3:30am', lbl: 'Hard sleep cutoff' }],
    blocks: [
      { time: '8:30', title: 'Wake — 8:30 latest', desc: "You'll be up till 3am. Don't sacrifice sleep for an early wake. 8:30 floor.", tags: ['8:30 max'] },
      { time: '8:30', title: 'Full morning ritual', desc: 'Water, breakfast, 15 min thinking, meditation. Today this IS the structure.', tags: ['do not skip'] },
      { time: '9:30', title: 'Deep work block 1 — 90 min', desc: 'School or business. One task. Phone away. Highest-leverage window.', tags: ['90 min'] },
      { time: '11:15', title: 'Deep work block 2 — 90 min', desc: 'Continue or switch tasks. Two blocks = a full productive day.', tags: ['90 min'] },
      { time: '13:00', title: 'Lunch — biggest meal', desc: "You won't eat properly at the bar. High protein, complex carbs. Make it count.", tags: ['eat properly'] },
      { time: '14:00', title: 'Gym OR rest', desc: 'If energy: gym now (won\'t go after shift). If tired: 20 min nap. Honest self-assessment only.', tags: ['honest call'] },
      { time: '15:30', title: 'Wind down before shift', desc: "Shower, snack, head right. Don't start new work — shift modes." },
      { time: '17:00', title: 'Bar shift', desc: "Present, on. Slow moments: think about business, don't stare at phone.", tags: ['parallel thinking'] },
      { time: '2–3am', title: 'After shift — wind down fast', desc: 'Small meal, one journal sentence, alarm set. In bed 30 min after home. No screens.', tags: ['no screens home'] },
    ],
  },
  school: {
    color: 'green',
    callout: "School heavy day — structure it or 6 hours of 'being at the laptop' becomes 2 hours of real work.",
    calloutType: 'success',
    wins: [{ val: '4.5hrs', lbl: 'Deep work' }, { val: '3', lbl: 'Tasks shipped' }, { val: '23:30', lbl: 'Lights out' }],
    blocks: [
      { time: '8:00', title: 'Wake + full morning ritual', desc: 'Peak day — start it right. Full 45 min.', tags: ['45 min ritual'] },
      { time: '8:45', title: 'Plan day — 10 min with AI', desc: 'Dump task list. Ask Claude to sort by priority. Pick 3 targets. Write on paper.', tags: ['use Claude'] },
      { time: '9:00', title: 'Block 1 — hardest task first', desc: 'Freshest brain, fewest decisions made. Hardest school task goes here.', tags: ['90 min'] },
      { time: '10:45', title: 'Block 2 — second task', desc: 'Same rules. Phone away. One task.', tags: ['90 min'] },
      { time: '12:15', title: 'Lunch — step away fully', desc: '30 min. Not at desk. 3 hours of real work — you earned it.' },
      { time: '13:00', title: 'Block 3 — lighter task', desc: 'Post-lunch: reviewing, fixing bugs, docs. Slightly lower intensity.', tags: ['medium difficulty'] },
      { time: '14:30', title: 'Gym — protect this', desc: "4.5 hours of deep work is a full day. Don't skip gym for more school.", tags: ['gym day'] },
      { time: '21:00', title: 'Shutdown', desc: '3 tasks written. Laptop closed. Done.', tags: ['10 min'] },
    ],
  },
  biz: {
    color: 'acc',
    callout: "Business day fails when it becomes a planning day. Visible progress = something exists that didn't yesterday. Not a doc about doing it.",
    calloutType: 'acc',
    wins: [{ val: '1', lbl: 'Thing shipped' }, { val: '10+', lbl: 'Outreach sent' }, { val: '3hrs', lbl: 'Build time' }],
    blocks: [
      { time: '8:00', title: 'Wake + morning ritual', desc: "15 min thinking: what's the one move that gets closer to a paying client or shipped product?", tags: ['think before AI'] },
      { time: '8:45', title: "Define the day's output", desc: 'ONE concrete deliverable. Must be completable today. Write it.', tags: ['one thing only'] },
      { time: '9:00', title: 'Outreach or client block', desc: 'No client: 5–10 personalised prospect messages. Client: their deliverable first.', tags: ['90 min', 'AI: outreach drafts'] },
      { time: '10:45', title: 'Build block — ship something', desc: 'n8n flow, AI demo, landing page, case study. Use AI to go 5x faster.', tags: ['90 min', 'AI: build + write'] },
      { time: '12:15', title: 'Lunch + mid-day check', desc: "Is the one thing done? If no — what's blocking it?" },
      { time: '13:00', title: 'Follow-up + admin', desc: 'Reply to messages, update pipeline, research prospects. Lower intensity.', tags: ['AI: summarise + draft'] },
      { time: '14:30', title: 'Gym — non-negotiable', desc: 'Business days trap you at laptop. Gym forces a reset. Best ideas come post-gym.', tags: ['protect this'] },
      { time: '17:00', title: 'Hard stop', desc: 'Did I make visible progress? Write one sentence on what shipped. Switch off.', tags: ['hard stop'] },
    ],
  },
}

// ── Day type labels ──────────────────────────────────────────────────────────
export const DAY_TYPES = [
  { id: 'team',   label: 'Team day',      sub: '9am–3pm meetings',        icon: '💻', color: 'blue'   },
  { id: 'bar',    label: 'Bar day',       sub: 'Shift 5pm–2/3am',         icon: '🍸', color: 'orange' },
  { id: 'school', label: 'School day',    sub: 'Max output, self-directed',icon: '📚', color: 'green'  },
  { id: 'biz',    label: 'Business day',  sub: 'Visible progress only',   icon: '🚀', color: 'acc'    },
]

// ── Tag type map ─────────────────────────────────────────────────────────────
export const TAG_TYPES = {
  '45 min ritual': 'hard',
  '90 min': 'hard',
  'do not skip': 'hard',
  'hard stop': 'hard',
  'one thing only': 'hard',
  'think before AI': 'hard',
  'eat properly': 'hard',
  '8:30 max': 'soft',
  '5 min': 'soft',
  'gym day': 'soft',
  'protect this': 'soft',
  'parallel thinking': 'soft',
  'no screens home': 'hard',
  'your choice': 'flex',
  'honest call': 'flex',
  'medium difficulty': 'flex',
  'use Claude': 'ai',
  'AI: summarise sprint': 'ai',
  'AI: outreach drafts': 'ai',
  'AI: build + write': 'ai',
  'AI: summarise + draft': 'ai',
  '10 min': 'hard',
  'no AI, no phone': 'hard',
}

// ── Mood levels ──────────────────────────────────────────────────────────────
export const MOOD_LEVELS = [
  { level: 1, label: 'Drained',    icon: '◦◦◦◦◦' },
  { level: 2, label: 'Low',        icon: '●◦◦◦◦' },
  { level: 3, label: 'Neutral',    icon: '●●◦◦◦' },
  { level: 4, label: 'Good',       icon: '●●●◦◦' },
  { level: 5, label: 'Energised',  icon: '●●●●●' },
]

// ── Nav items ────────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { path: '/',          label: 'Dashboard',    dot: 'var(--acc)',    group: 'Today',    mobileIcon: '⊙', mobileLabel: 'Today' },
  { path: '/schedule',  label: 'Day schedule', dot: 'var(--blue)',   group: 'Today',    mobileIcon: '◈', mobileLabel: 'Schedule' },
  { path: '/habits',    label: 'Habits',       dot: 'var(--green)',  group: 'Today',    mobileIcon: '◉', mobileLabel: 'Habits' },
  { path: '/gym',       label: 'Gym log',      dot: 'var(--orange)', group: 'Training', mobileIcon: '◧', mobileLabel: 'Gym' },
  { path: '/nutrition', label: 'Nutrition',    dot: 'var(--purple)', group: 'Training' },
  { path: '/journal',   label: 'Journal',      dot: 'var(--acc2)',   group: 'Mind' },
  { path: '/sleep',     label: 'Sleep',        dot: 'var(--blue)',   group: 'Mind' },
  { path: '/focus',     label: 'Focus rules',  dot: 'var(--red)',    group: 'Mind' },
  { path: '/school',    label: 'School',       dot: 'var(--green)',  group: 'Progress' },
  { path: '/business',  label: 'Business',     dot: 'var(--acc)',    group: 'Progress' },
  { path: '/review',    label: 'Weekly review',dot: 'var(--purple)', group: 'Progress' },
]

export const BOTTOM_NAV = [
  { path: '/',         label: 'Today',    icon: '⊙' },
  { path: '/schedule', label: 'Schedule', icon: '◈' },
  { path: '/habits',   label: 'Habits',   icon: '◉' },
  { path: '/gym',      label: 'Gym',      icon: '◧' },
  { path: '/more',     label: 'More',     icon: '⋯' },
]

export const MORE_NAV = [
  { path: '/nutrition', label: 'Nutrition',    icon: '◍' },
  { path: '/journal',   label: 'Journal',      icon: '◫' },
  { path: '/sleep',     label: 'Sleep',        icon: '◒' },
  { path: '/focus',     label: 'Focus rules',  icon: '◎' },
  { path: '/school',    label: 'School',       icon: '◪' },
  { path: '/business',  label: 'Business',     icon: '◬' },
  { path: '/review',    label: 'Weekly review',icon: '◐' },
]
