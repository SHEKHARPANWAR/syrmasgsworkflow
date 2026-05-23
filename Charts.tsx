import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { THROUGHPUT, STAGE_LOAD } from "@/lib/mock-data";

const tooltipStyle = {
  contentStyle: {
    background: "oklch(0.18 0.03 240 / 0.95)",
    border: "1px solid oklch(0.55 0.12 220 / 0.4)",
    borderRadius: 8,
    fontSize: 12,
    color: "white",
  },
  labelStyle: { color: "oklch(0.82 0.18 200)" },
} as const;

export function ThroughputChart() {
  return (
    <div className="glass scanline relative overflow-hidden rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Throughput · Boards/hr</div>
          <div className="font-display text-base">Stage Production · Last 12h</div>
        </div>
        <div className="flex gap-3 text-[10px]">
          <Legend color="var(--cyan)" label="SMT" />
          <Legend color="var(--neon)" label="MI" />
          <Legend color="var(--success)" label="BLT" />
          <Legend color="var(--warning)" label="FATP" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={THROUGHPUT}>
          <defs>
            {["smt","mi","blt","fatp"].map((id, i) => {
              const c = ["var(--cyan)","var(--neon)","var(--success)","var(--warning)"][i];
              return (
                <linearGradient id={`g-${id}`} key={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={c} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid stroke="oklch(0.30 0.04 235 / 0.35)" vertical={false} />
          <XAxis dataKey="hour" tick={{ fill: "oklch(0.7 0.03 230)", fontSize: 10 }} stroke="oklch(0.30 0.04 235)" />
          <YAxis tick={{ fill: "oklch(0.7 0.03 230)", fontSize: 10 }} stroke="oklch(0.30 0.04 235)" />
          <Tooltip {...tooltipStyle} />
          <Area type="monotone" dataKey="SMT"  stroke="var(--cyan)"    fill="url(#g-smt)"  strokeWidth={2} />
          <Area type="monotone" dataKey="MI"   stroke="var(--neon)"    fill="url(#g-mi)"   strokeWidth={2} />
          <Area type="monotone" dataKey="BLT"  stroke="var(--success)" fill="url(#g-blt)"  strokeWidth={2} />
          <Area type="monotone" dataKey="FATP" stroke="var(--warning)" fill="url(#g-fatp)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StageLoadChart() {
  return (
    <div className="glass scanline relative overflow-hidden rounded-xl p-4">
      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Bottleneck Heat · Stage Load</div>
        <div className="font-display text-base">Capacity Utilization</div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={STAGE_LOAD}>
          <defs>
            <linearGradient id="g-load" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--neon)" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="oklch(0.30 0.04 235 / 0.35)" vertical={false} />
          <XAxis dataKey="stage" tick={{ fill: "oklch(0.7 0.03 230)", fontSize: 10 }} stroke="oklch(0.30 0.04 235)" />
          <YAxis tick={{ fill: "oklch(0.7 0.03 230)", fontSize: 10 }} stroke="oklch(0.30 0.04 235)" domain={[0, 100]} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="load" fill="url(#g-load)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <span className="size-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {label}
    </div>
  );
}
