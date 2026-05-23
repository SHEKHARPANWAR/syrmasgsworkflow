import { ArrowRight, Users } from "lucide-react";
import { MANPOWER, manpowerSuggestions } from "@/lib/mock-data";

export function ManpowerPanel() {
  const suggestions = manpowerSuggestions(MANPOWER);
  return (
    <div className="glass scanline relative overflow-hidden rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Manpower · Live Floor</div>
          <div className="font-display text-base">Stage Utilization</div>
        </div>
        <Users className="size-4 text-[var(--cyan)]" />
      </div>

      <div className="space-y-2">
        {MANPOWER.map((m) => {
          const util = Math.round((m.working / m.total) * 100);
          const shortage = m.required > m.total;
          const tone = shortage ? "var(--danger)" : util > 90 ? "var(--warning)" : m.idle > 3 ? "var(--neon)" : "var(--success)";
          return (
            <div key={m.stage} className="rounded-lg border border-border/60 bg-[oklch(0.20_0.03_240_/_0.5)] p-2.5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm font-semibold">{m.stage}</div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  <span className="text-foreground">{m.working}</span>/{m.total}
                  <span className="ml-2 text-[var(--neon)]">idle {m.idle}</span>
                  {shortage && <span className="ml-2 text-[var(--danger)]">need +{m.required - m.total}</span>}
                </div>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[oklch(0.30_0.04_235_/_0.4)]">
                <div className="h-full rounded-full" style={{ width: `${util}%`, background: tone, boxShadow: `0 0 10px ${tone}` }} />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[10px]">
                <span className="text-muted-foreground">Utilization</span>
                <span style={{ color: tone }}>{util}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 rounded-lg border border-[var(--cyan)]/30 bg-[oklch(0.78_0.18_200_/_0.06)] p-3">
          <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[var(--cyan)]">AI Suggestion · Reallocate</div>
          <div className="space-y-1.5">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-xs">
                <span className="rounded bg-[oklch(0.30_0.04_235)] px-1.5 py-0.5">{s.from}</span>
                <ArrowRight className="size-3 text-[var(--cyan)]" />
                <span className="rounded bg-[oklch(0.30_0.04_235)] px-1.5 py-0.5">{s.to}</span>
                <span className="ml-auto text-[var(--cyan)]">+{s.count} ops</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
