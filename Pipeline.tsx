import { motion } from "framer-motion";
import { CheckCircle2, AlertOctagon, Loader2, Circle } from "lucide-react";
import { STAGES, type Workorder, type StageStatus } from "@/lib/mock-data";

const toneByStatus: Record<StageStatus, { ring: string; text: string; bg: string; label: string }> = {
  completed: { ring: "ring-success", text: "var(--success)", bg: "color-mix(in oklab, var(--success) 14%, transparent)", label: "DONE" },
  running:   { ring: "ring-warn",    text: "var(--warning)", bg: "color-mix(in oklab, var(--warning) 14%, transparent)", label: "ACTIVE" },
  delayed:   { ring: "ring-danger blink-danger", text: "var(--danger)", bg: "color-mix(in oklab, var(--danger) 16%, transparent)", label: "DELAYED" },
  pending:   { ring: "",             text: "oklch(0.6 0.02 240)", bg: "oklch(0.24 0.025 240 / 0.6)", label: "QUEUED" },
};

export function Pipeline({ wo }: { wo: Workorder }) {
  return (
    <div className="glass scanline relative overflow-hidden rounded-xl p-6">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Material Flow Pipeline</div>
          <div className="font-display mt-1 text-xl">
            <span className="neon-cyan">{wo.id}</span>
            <span className="ml-3 text-sm text-muted-foreground">{wo.product} · {wo.customer}</span>
          </div>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          QTY {wo.qty} · Priority <span className="text-[var(--cyan)]">{wo.priority}</span>
        </div>
      </div>

      <div className="relative">
        {/* Connecting flow line */}
        <svg className="pointer-events-none absolute inset-x-0 top-[58px] h-1 w-full" preserveAspectRatio="none" viewBox="0 0 1000 4">
          <line x1="0" y1="2" x2="1000" y2="2" stroke="oklch(0.30 0.04 235)" strokeWidth="2" />
          <line x1="0" y1="2" x2="1000" y2="2" stroke="var(--cyan)" strokeWidth="2" className="flow-line" opacity="0.85" />
        </svg>

        <div className="relative grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {STAGES.map((s, i) => {
            const stage = wo.stages[i];
            const tone = toneByStatus[stage.status];
            const pct = Math.round((stage.boardsDone / stage.total) * 100);
            const Icon =
              stage.status === "completed" ? CheckCircle2 :
              stage.status === "running"   ? Loader2 :
              stage.status === "delayed"   ? AlertOctagon : Circle;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative"
              >
                <div className={`glass relative rounded-lg p-3 ${tone.ring}`} style={{ background: tone.bg }}>
                  <div className="flex items-center justify-between">
                    <div className="font-display text-sm font-bold" style={{ color: tone.text }}>{s.label}</div>
                    <Icon
                      className={`size-4 ${stage.status === "running" ? "animate-spin" : ""}`}
                      style={{ color: tone.text }}
                    />
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{s.full}</div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[oklch(0.30_0.04_235_/_0.4)]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: tone.text, boxShadow: `0 0 12px ${tone.text}` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                    <span>{stage.boardsDone}/{stage.total}</span>
                    <span style={{ color: tone.text }}>{tone.label}</span>
                  </div>

                  <div className="mt-2 space-y-1 border-t border-border/60 pt-2 text-[10px]">
                    <Row k="Resp." v={stage.responsible} />
                    <Row k="Spec." v={stage.specialist} />
                    {stage.status === "running" && stage.etaMin != null && (
                      <Row k="ETA"  v={`${stage.etaMin}m`} accent="var(--warning)" />
                    )}
                    {stage.status === "delayed" && stage.delayMin != null && (
                      <Row k="Delay" v={`+${stage.delayMin}m`} accent="var(--danger)" />
                    )}
                    {stage.entryAt && (
                      <Row k="In"   v={new Date(stage.entryAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
                    )}
                    {stage.exitAt && (
                      <Row k="Out"  v={new Date(stage.exitAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground/80">{k}</span>
      <span className="font-mono truncate" style={{ color: accent ?? "inherit" }}>{v}</span>
    </div>
  );
}
