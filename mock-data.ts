export type StageKey = "IGI" | "SMT" | "MI" | "BLT" | "FATP" | "SHIP";

export const STAGES: { key: StageKey; label: string; full: string }[] = [
  { key: "IGI",  label: "IGI",  full: "Incoming Goods Inspection" },
  { key: "SMT",  label: "SMT",  full: "Surface Mount Technology" },
  { key: "MI",   label: "MI",   full: "Manual Insertion" },
  { key: "BLT",  label: "BLT",  full: "Board Level Test" },
  { key: "FATP", label: "FATP", full: "Final Assembly, Test & Pack" },
  { key: "SHIP", label: "SHIP", full: "Ready for Shipment" },
];

export type StageStatus = "completed" | "running" | "delayed" | "pending";

export interface StageProgress {
  key: StageKey;
  status: StageStatus;
  entryAt?: string;
  exitAt?: string;
  boardsDone: number;
  total: number;
  responsible: string;
  specialist: string;
  etaMin?: number;     // expected minutes remaining
  delayMin?: number;   // delay minutes
}

export interface Workorder {
  id: string;            // WO number
  product: string;
  customer: string;
  qty: number;
  startedAt: string;
  priority: "P1" | "P2" | "P3";
  stages: StageProgress[];
}

export interface Manpower {
  stage: StageKey;
  total: number;
  working: number;
  idle: number;
  required: number; // ideal count for current load
}

const now = Date.now();
const t = (minAgo: number) => new Date(now - minAgo * 60_000).toISOString();

function buildStages(progress: { current: number; delayedIdx?: number; boardsAtCurrent?: number; total: number; }): StageProgress[] {
  const responsibles = ["A. Krishnan", "M. Reddy", "S. Iyer", "P. Banerjee", "R. Naidu", "V. Sharma"];
  const specialists  = ["Dr. Rao",     "Eng. Patel", "Eng. Joshi", "Dr. Mehta",  "Eng. Kapoor", "Eng. Singh"];
  return STAGES.map((s, i) => {
    const isDone = i < progress.current;
    const isCurrent = i === progress.current;
    const isDelayed = progress.delayedIdx === i;
    const status: StageStatus = isDelayed
      ? "delayed"
      : isDone
      ? "completed"
      : isCurrent
      ? "running"
      : "pending";
    return {
      key: s.key,
      status,
      entryAt: i <= progress.current ? t(180 - i * 25) : undefined,
      exitAt: isDone ? t(180 - i * 25 - 18) : undefined,
      boardsDone: isDone ? progress.total : isCurrent ? (progress.boardsAtCurrent ?? Math.floor(progress.total * 0.45)) : 0,
      total: progress.total,
      responsible: responsibles[i],
      specialist: specialists[i],
      etaMin: isCurrent ? 35 + i * 4 : undefined,
      delayMin: isDelayed ? 47 : undefined,
    };
  });
}

export const WORKORDERS: Workorder[] = [
  {
    id: "WO-2451-A",
    product: "Automotive ECU Rev-C",
    customer: "TATA Motors",
    qty: 1200,
    startedAt: t(420),
    priority: "P1",
    stages: buildStages({ current: 2, total: 1200, boardsAtCurrent: 740 }),
  },
  {
    id: "WO-2452-B",
    product: "Smart Meter Mainboard",
    customer: "Siemens Energy",
    qty: 800,
    startedAt: t(360),
    priority: "P2",
    stages: buildStages({ current: 3, delayedIdx: 3, total: 800, boardsAtCurrent: 312 }),
  },
  {
    id: "WO-2453-C",
    product: "Medical Imaging PCB",
    customer: "GE Healthcare",
    qty: 450,
    startedAt: t(540),
    priority: "P1",
    stages: buildStages({ current: 4, total: 450, boardsAtCurrent: 280 }),
  },
  {
    id: "WO-2454-D",
    product: "EV Charger Controller",
    customer: "Bosch India",
    qty: 600,
    startedAt: t(220),
    priority: "P2",
    stages: buildStages({ current: 1, total: 600, boardsAtCurrent: 410 }),
  },
  {
    id: "WO-2455-E",
    product: "Telecom RF Module",
    customer: "Reliance Jio",
    qty: 2000,
    startedAt: t(700),
    priority: "P3",
    stages: buildStages({ current: 5, total: 2000 }),
  },
  {
    id: "WO-2456-F",
    product: "Industrial IoT Gateway",
    customer: "Honeywell",
    qty: 320,
    startedAt: t(150),
    priority: "P1",
    stages: buildStages({ current: 0, total: 320, boardsAtCurrent: 120 }),
  },
  {
    id: "WO-2457-G",
    product: "Drone Flight Computer",
    customer: "Garuda Aerospace",
    qty: 180,
    startedAt: t(280),
    priority: "P2",
    stages: buildStages({ current: 2, delayedIdx: 2, total: 180, boardsAtCurrent: 60 }),
  },
];

export const MANPOWER: Manpower[] = [
  { stage: "IGI",  total: 12, working: 9,  idle: 3, required: 8 },
  { stage: "SMT",  total: 28, working: 26, idle: 2, required: 30 },
  { stage: "MI",   total: 22, working: 20, idle: 2, required: 24 },
  { stage: "BLT",  total: 14, working: 13, idle: 1, required: 16 },
  { stage: "FATP", total: 18, working: 12, idle: 6, required: 12 },
  { stage: "SHIP", total: 8,  working: 5,  idle: 3, required: 5 },
];

export const KPIS = {
  running: WORKORDERS.filter(w => w.stages.some(s => s.status === "running")).length,
  delayed: WORKORDERS.filter(w => w.stages.some(s => s.status === "delayed")).length,
  completedToday: 14,
  efficiency: 87.4,
  onTime: 92.1,
  wip: WORKORDERS.reduce((acc, w) => acc + (w.stages.find(s => s.status === "running")?.boardsDone ?? 0), 0),
};

// throughput series (boards per hour) over last 12 hours
export const THROUGHPUT = Array.from({ length: 12 }).map((_, i) => ({
  hour: `${String((new Date().getHours() - 11 + i + 24) % 24).padStart(2, "0")}:00`,
  IGI: 60 + Math.round(Math.sin(i / 2) * 12 + Math.random() * 8),
  SMT: 95 + Math.round(Math.cos(i / 3) * 18 + Math.random() * 10),
  MI:  72 + Math.round(Math.sin(i / 2.5) * 14 + Math.random() * 9),
  BLT: 55 + Math.round(Math.cos(i / 2) * 10 + Math.random() * 7),
  FATP:48 + Math.round(Math.sin(i / 3.5) * 9 + Math.random() * 6),
}));

export const STAGE_LOAD = STAGES.map((s, i) => ({
  stage: s.label,
  load: [62, 91, 78, 55, 71, 38][i],
  capacity: 100,
}));

export function manpowerSuggestions(rows: Manpower[]) {
  const surplus = rows.filter(r => r.idle > 0 && r.total > r.required).sort((a, b) => (b.total - b.required) - (a.total - a.required));
  const deficit = rows.filter(r => r.required > r.total).sort((a, b) => (b.required - b.total) - (a.required - a.total));
  const suggestions: { from: StageKey; to: StageKey; count: number }[] = [];
  const surplusCopy = surplus.map(s => ({ ...s }));
  for (const d of deficit) {
    let need = d.required - d.total;
    for (const s of surplusCopy) {
      if (need <= 0) break;
      const avail = Math.min(s.idle, s.total - s.required);
      if (avail <= 0) continue;
      const move = Math.min(avail, need);
      suggestions.push({ from: s.stage, to: d.stage, count: move });
      s.idle -= move; s.total -= move; need -= move;
    }
  }
  return suggestions;
}
