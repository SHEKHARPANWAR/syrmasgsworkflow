import { AlertTriangle, Bot, Radio, Zap } from "lucide-react";

const items = [
  { icon: AlertTriangle, color: "var(--danger)",  text: "WO-2452-B stuck at BLT for 47m — bottleneck risk" },
  { icon: Bot,           color: "var(--cyan)",    text: "AI predicts SMT capacity breach in 35m at current pace" },
  { icon: Radio,         color: "var(--success)", text: "WO-2455-E fully shipped · 2,000 boards · 0 defects" },
  { icon: Zap,           color: "var(--warning)", text: "FATP idle manpower 6 — recommended shift to MI" },
  { icon: AlertTriangle, color: "var(--danger)",  text: "WO-2457-G delay > SLA · WhatsApp alert dispatched to Plant Head" },
  { icon: Bot,           color: "var(--neon)",    text: "Shift A throughput +12.4% vs Shift B baseline" },
];

export function AlertTicker() {
  const list = [...items, ...items];
  return (
    <div className="glass relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-2.5">
      <div className="font-display flex shrink-0 items-center gap-2 text-xs">
        <span className="size-2 animate-pulse rounded-full bg-[var(--danger)]" />
        <span className="text-[var(--cyan)]">LIVE FEED</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="ticker flex gap-10 whitespace-nowrap">
          {list.map((it, i) => {
            const Icon = it.icon;
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <Icon className="size-3.5" style={{ color: it.color }} />
                <span className="text-muted-foreground">{it.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
