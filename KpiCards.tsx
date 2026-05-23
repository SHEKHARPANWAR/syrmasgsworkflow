import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Factory, Gauge, PackageCheck, Workflow } from "lucide-react";
import type { ReactNode } from "react";
import { KPIS } from "@/lib/mock-data";

const cards: { label: string; value: string | number; sub: string; icon: ReactNode; tone: string }[] = [
  { label: "Running Workorders", value: KPIS.running, sub: "Across 6 stages", icon: <Workflow className="size-5" />, tone: "var(--cyan)" },
  { label: "Delayed Workorders", value: KPIS.delayed, sub: "SLA breach risk",  icon: <AlertTriangle className="size-5" />, tone: "var(--danger)" },
  { label: "Completed Today",    value: KPIS.completedToday, sub: "vs 12 yesterday", icon: <CheckCircle2 className="size-5" />, tone: "var(--success)" },
  { label: "Factory Efficiency", value: `${KPIS.efficiency}%`, sub: "OEE — Shift A",  icon: <Gauge className="size-5" />, tone: "var(--neon)" },
  { label: "On-Time Delivery",   value: `${KPIS.onTime}%`, sub: "Rolling 7d",        icon: <PackageCheck className="size-5" />, tone: "var(--warning)" },
  { label: "WIP Boards",         value: KPIS.wip.toLocaleString(), sub: "In production", icon: <Factory className="size-5" />, tone: "var(--cyan)" },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass scanline relative overflow-hidden rounded-xl p-4"
        >
          <div className="flex items-start justify-between">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.label}</div>
            <div className="grid size-8 place-items-center rounded-md" style={{ background: `color-mix(in oklab, ${c.tone} 18%, transparent)`, color: c.tone }}>
              {c.icon}
            </div>
          </div>
          <div className="font-display mt-3 text-3xl font-bold" style={{ color: c.tone, textShadow: `0 0 18px color-mix(in oklab, ${c.tone} 50%, transparent)` }}>
            {c.value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{c.sub}</div>
          <div className="absolute -bottom-8 -right-8 size-24 rounded-full opacity-30 blur-2xl" style={{ background: c.tone }} />
        </motion.div>
      ))}
    </div>
  );
}
