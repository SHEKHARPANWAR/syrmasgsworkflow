import { Activity, Bell, Cpu, Search, ScanLine, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar({ query, setQuery }: { query: string; setQuery: (s: string) => void }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <header className="glass-strong sticky top-0 z-40 flex items-center gap-4 rounded-none border-b px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="ring-neon grid size-10 place-items-center rounded-md bg-[oklch(0.20_0.04_240)]">
          <Cpu className="size-5 text-[var(--cyan)]" />
        </div>
        <div className="leading-tight">
          <div className="font-display neon-cyan text-lg font-bold">SYRMA SGS</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            MES · Production Control Tower
          </div>
        </div>
      </div>

      <div className="ml-6 hidden items-center gap-2 md:flex">
        <span className="size-2 animate-pulse rounded-full bg-[var(--success)]" />
        <span className="text-xs text-muted-foreground">
          Live · {time.toLocaleTimeString()} · Shift A
        </span>
      </div>

      <div className="relative ml-auto w-full max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Scan or search workorder (WO-2451-A)…"
          className="font-mono w-full rounded-md border border-border bg-[oklch(0.18_0.03_240)] py-2 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
        />
        <ScanLine className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--cyan)]" />
      </div>

      <div className="flex items-center gap-2">
        <button className="glass relative grid size-10 place-items-center rounded-md hover:ring-neon">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-2 animate-pulse rounded-full bg-[var(--danger)]" />
        </button>
        <button className="glass grid size-10 place-items-center rounded-md hover:ring-neon">
          <Activity className="size-4" />
        </button>
        <div className="glass hidden items-center gap-2 rounded-md px-3 py-2 text-xs md:flex">
          <ShieldCheck className="size-4 text-[var(--success)]" />
          <span className="text-muted-foreground">Admin · K. Rao</span>
        </div>
      </div>
    </header>
  );
}
