import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { Pipeline } from "@/components/dashboard/Pipeline";
import { WorkorderList } from "@/components/dashboard/WorkorderList";
import { ThroughputChart, StageLoadChart } from "@/components/dashboard/Charts";
import { ManpowerPanel } from "@/components/dashboard/Manpower";
import { AlertTicker } from "@/components/dashboard/AlertTicker";
import { ScanStation, type ScanEvent } from "@/components/dashboard/ScanStation";
import { STAGES, WORKORDERS, type StageKey, type Workorder } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Syrma SGS · MES Production Control Tower" },
      { name: "description", content: "Real-time MES dashboard for Syrma SGS — workorder flow, manpower, bottlenecks across IGI, SMT, MI, BLT, FATP and shipment." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [query, setQuery] = useState("");
  const [workorders, setWorkorders] = useState<Workorder[]>(WORKORDERS);
  const [selectedId, setSelectedId] = useState(WORKORDERS[1].id);
  const [scanLog, setScanLog] = useState<ScanEvent[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workorders;
    return workorders.filter(
      (w) =>
        w.id.toLowerCase().includes(q) ||
        w.product.toLowerCase().includes(q) ||
        w.customer.toLowerCase().includes(q),
    );
  }, [query, workorders]);

  const selected = workorders.find((w) => w.id === selectedId) ?? workorders[0];

  const handleScan = useCallback(
    (woId: string, stageKey: StageKey, type: "ENTRY" | "EXIT") => {
      const ts = new Date().toISOString();
      const operator = "K. Rao";
      setWorkorders((prev) =>
        prev.map((w) => {
          if (w.id !== woId) return w;
          const idx = STAGES.findIndex((s) => s.key === stageKey);
          const stages = w.stages.map((s) => ({ ...s }));
          const cur = stages[idx];
          if (type === "ENTRY") {
            cur.entryAt = ts;
            if (cur.status === "pending") cur.status = "running";
            if (cur.boardsDone === 0) cur.boardsDone = Math.max(1, Math.floor(cur.total * 0.05));
          } else {
            cur.exitAt = ts;
            cur.status = "completed";
            cur.boardsDone = cur.total;
            cur.etaMin = undefined;
            cur.delayMin = undefined;
            const nxt = stages[idx + 1];
            if (nxt && nxt.status === "pending") {
              nxt.status = "running";
              nxt.entryAt = ts;
              nxt.boardsDone = Math.max(1, Math.floor(nxt.total * 0.02));
              nxt.etaMin = 30;
            }
          }
          return { ...w, stages };
        }),
      );
      setScanLog((prev) =>
        [
          {
            id: `${ts}-${Math.random().toString(36).slice(2, 7)}`,
            ts,
            woId,
            stage: stageKey,
            type,
            operator,
          },
          ...prev,
        ].slice(0, 50),
      );
    },
    [],
  );

  return (
    <div className="min-h-screen text-foreground">
      <TopBar query={query} setQuery={setQuery} />

      <main className="mx-auto max-w-[1600px] space-y-4 p-4 md:p-6">
        <AlertTicker />
        <KpiCards />
        <Pipeline wo={selected} />

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3 h-[520px]">
            <WorkorderList workorders={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <ScanStation
              workorders={workorders}
              selectedId={selectedId}
              onScan={handleScan}
              log={scanLog}
            />
            <ThroughputChart />
            <StageLoadChart />
          </div>
          <div className="lg:col-span-3">
            <ManpowerPanel />
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-border/40 py-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>Syrma SGS Technology · Plant 03 · Chennai</span>
          <span className="font-mono">MES v4.2 · Industry 4.0</span>
        </footer>
      </main>
    </div>
  );
}
