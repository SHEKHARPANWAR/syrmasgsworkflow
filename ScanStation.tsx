import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, ScanLine, LogIn, LogOut, Zap, CheckCircle2 } from "lucide-react";
import { STAGES, type StageKey, type Workorder } from "@/lib/mock-data";

export type ScanEvent = {
  id: string;
  ts: string;
  woId: string;
  stage: StageKey;
  type: "ENTRY" | "EXIT";
  operator: string;
};

export function ScanStation({
  workorders,
  selectedId,
  onScan,
  log,
}: {
  workorders: Workorder[];
  selectedId: string;
  onScan: (woId: string, stage: StageKey, type: "ENTRY" | "EXIT") => void;
  log: ScanEvent[];
}) {
  const wo = workorders.find((w) => w.id === selectedId) ?? workorders[0];
  const [stage, setStage] = useState<StageKey>(() => {
    const cur = wo.stages.find((s) => s.status === "running" || s.status === "delayed");
    return cur?.key ?? "IGI";
  });
  const [type, setType] = useState<"ENTRY" | "EXIT">("ENTRY");
  const [pulse, setPulse] = useState(0);

  const code = useMemo(() => `${wo.id}|${stage}|${type}`, [wo.id, stage, type]);
  const grid = useMemo(() => buildQrGrid(code), [code]);

  const trigger = () => {
    onScan(wo.id, stage, type);
    setPulse((p) => p + 1);
  };

  const stageProg = wo.stages.find((s) => s.key === stage)!;

  return (
    <div className="glass scanline relative overflow-hidden rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scan Station</div>
          <div className="font-display mt-0.5 text-lg">
            <span className="neon-cyan">QR / Barcode</span>
            <span className="ml-2 text-xs text-muted-foreground">Entry / Exit Logger</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-[oklch(0.20_0.04_240)] px-2 py-1 font-mono text-[10px] text-[var(--success)]">
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--success)]" /> READER ONLINE
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[200px_1fr]">
        {/* QR visual */}
        <div className="relative">
          <div className="relative grid aspect-square place-items-center overflow-hidden rounded-lg border border-[var(--cyan)]/40 bg-[oklch(0.14_0.03_240)] p-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={code + pulse}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid h-full w-full"
                style={{ gridTemplateColumns: `repeat(${grid.size}, 1fr)` }}
              >
                {grid.cells.map((on, i) => (
                  <div
                    key={i}
                    style={{
                      background: on ? "var(--cyan)" : "transparent",
                      boxShadow: on ? "0 0 4px var(--cyan)" : undefined,
                    }}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
            <motion.div
              key={pulse}
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute inset-x-0 h-[2px]"
              style={{ background: "linear-gradient(90deg, transparent, var(--cyan), transparent)", boxShadow: "0 0 12px var(--cyan)" }}
            />
            {/* corner brackets */}
            {[
              "left-1 top-1 border-l-2 border-t-2",
              "right-1 top-1 border-r-2 border-t-2",
              "left-1 bottom-1 border-l-2 border-b-2",
              "right-1 bottom-1 border-r-2 border-b-2",
            ].map((c, i) => (
              <div key={i} className={`absolute size-4 border-[var(--cyan)] ${c}`} />
            ))}
          </div>
          <div className="mt-2 truncate text-center font-mono text-[10px] text-muted-foreground">{code}</div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div>
            <Label>Workorder</Label>
            <div className="font-mono mt-1 flex items-center gap-2 rounded-md border border-border bg-[oklch(0.18_0.03_240)] px-3 py-2 text-sm">
              <QrCode className="size-4 text-[var(--cyan)]" />
              <span className="neon-cyan">{wo.id}</span>
              <span className="ml-auto text-xs text-muted-foreground">{wo.product}</span>
            </div>
          </div>

          <div>
            <Label>Stage</Label>
            <div className="mt-1 grid grid-cols-6 gap-1">
              {STAGES.map((s) => {
                const active = s.key === stage;
                return (
                  <button
                    key={s.key}
                    onClick={() => setStage(s.key)}
                    className={`font-mono rounded-md border px-1 py-1.5 text-[10px] transition-colors ${
                      active
                        ? "border-[var(--cyan)] bg-[oklch(0.78_0.18_210_/_0.12)] text-[var(--cyan)]"
                        : "border-border text-muted-foreground hover:border-[var(--cyan)]/50"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label>Action</Label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <button
                onClick={() => setType("ENTRY")}
                className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                  type === "ENTRY"
                    ? "border-[var(--success)] bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]"
                    : "border-border text-muted-foreground hover:border-[var(--success)]/50"
                }`}
              >
                <LogIn className="size-4" /> ENTRY
              </button>
              <button
                onClick={() => setType("EXIT")}
                className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                  type === "EXIT"
                    ? "border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] text-[var(--warning)]"
                    : "border-border text-muted-foreground hover:border-[var(--warning)]/50"
                }`}
              >
                <LogOut className="size-4" /> EXIT
              </button>
            </div>
          </div>

          <button
            onClick={trigger}
            className="ring-neon group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-gradient-to-r from-[var(--cyan)]/30 to-[var(--cyan)]/10 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.25em] text-[var(--cyan)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <ScanLine className="size-4" />
            Scan now
            <Zap className="size-4" />
          </button>

          <div className="font-mono flex items-center justify-between rounded-md border border-border/60 bg-[oklch(0.16_0.03_240)] px-3 py-2 text-[10px] text-muted-foreground">
            <span>{stage} · {stageProg.responsible}</span>
            <span>
              IN {stageProg.entryAt ? new Date(stageProg.entryAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—"}
              {"  ·  "}
              OUT {stageProg.exitAt ? new Date(stageProg.exitAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Scan log */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <Label>Recent Scans</Label>
          <span className="font-mono text-[10px] text-muted-foreground">{log.length} events</span>
        </div>
        <div className="max-h-44 overflow-y-auto rounded-md border border-border/60 bg-[oklch(0.14_0.03_240)]">
          {log.length === 0 && (
            <div className="p-3 text-center font-mono text-[10px] text-muted-foreground">
              No scans yet. Trigger a scan above to log ENTRY / EXIT.
            </div>
          )}
          <AnimatePresence initial={false}>
            {log.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 border-b border-border/40 px-3 py-2 font-mono text-[11px] last:border-b-0"
              >
                <CheckCircle2
                  className="size-3.5"
                  style={{ color: e.type === "ENTRY" ? "var(--success)" : "var(--warning)" }}
                />
                <span className="text-muted-foreground">{new Date(e.ts).toLocaleTimeString()}</span>
                <span className="neon-cyan">{e.woId}</span>
                <span className="rounded bg-[oklch(0.30_0.04_235)] px-1.5 py-0.5 text-[9px] text-[var(--cyan)]">{e.stage}</span>
                <span style={{ color: e.type === "ENTRY" ? "var(--success)" : "var(--warning)" }}>{e.type}</span>
                <span className="ml-auto text-muted-foreground">{e.operator}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{children}</div>;
}

// Deterministic pseudo-QR pattern from string (visual only).
function buildQrGrid(input: string) {
  const size = 21;
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const cells: boolean[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // finder patterns at 3 corners
      const inFinder =
        (x < 7 && y < 7) ||
        (x >= size - 7 && y < 7) ||
        (x < 7 && y >= size - 7);
      if (inFinder) {
        const fx = x < 7 ? x : size - 1 - x;
        const fy = y < 7 ? y : size - 1 - y;
        const isBox =
          fx === 0 || fx === 6 || fy === 0 || fy === 6 ||
          (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
        cells.push(isBox);
        continue;
      }
      h = Math.imul(h ^ (x * 73 + y * 179), 16777619);
      cells.push(((h >>> 0) % 7) < 3);
    }
  }
  return { size, cells };
}
