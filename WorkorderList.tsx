import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Workorder } from "@/lib/mock-data";

export function WorkorderList({
  workorders, selectedId, onSelect,
}: { workorders: Workorder[]; selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Active Workorders</div>
        <div className="font-mono text-xs text-[var(--cyan)]">{workorders.length}</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {workorders.map((wo) => {
          const current = wo.stages.find(s => s.status === "running" || s.status === "delayed");
          const isDelayed = wo.stages.some(s => s.status === "delayed");
          const completedCount = wo.stages.filter(s => s.status === "completed").length;
          const pct = Math.round((completedCount / wo.stages.length) * 100);
          const sel = selectedId === wo.id;
          return (
            <motion.button
              key={wo.id}
              onClick={() => onSelect(wo.id)}
              whileHover={{ x: 2 }}
              className={`group flex w-full items-center gap-3 border-b border-border/40 px-4 py-3 text-left transition-colors ${
                sel ? "bg-[oklch(0.78_0.18_210_/_0.08)]" : "hover:bg-white/[0.02]"
              }`}
            >
              <div
                className="size-2 shrink-0 rounded-full"
                style={{
                  background: isDelayed ? "var(--danger)" : "var(--success)",
                  boxShadow: `0 0 10px ${isDelayed ? "var(--danger)" : "var(--success)"}`,
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className={`font-mono text-sm font-semibold ${sel ? "neon-cyan" : ""}`}>{wo.id}</div>
                  <span className="rounded bg-[oklch(0.30_0.04_235)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--cyan)]">{wo.priority}</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">{wo.product}</div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[oklch(0.30_0.04_235_/_0.4)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: isDelayed ? "var(--danger)" : "var(--cyan)",
                      boxShadow: `0 0 8px ${isDelayed ? "var(--danger)" : "var(--cyan)"}`,
                    }}
                  />
                </div>
                <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                  <span>{current?.key ?? "DONE"}</span>
                  <span>{pct}%</span>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
