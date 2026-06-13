import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { type RiskLevel } from "@/lib/mock-data";
import { RiskBadge } from "@/components/risk-badge";
import { SectionHeader } from "@/components/section-header";
import { Activity, Filter, Loader2 } from "lucide-react";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "Incident Timeline — Sentinel AI" },
      { name: "description", content: "Chronological view of detections, escalations, and contained threats." },
      { property: "og:title", content: "Incident Timeline — Sentinel AI" },
      { property: "og:description", content: "Chronological view of detections, escalations, and contained threats." },
    ],
  }),
  component: IncidentTimeline,
});

const filters: (RiskLevel | "all")[] = ["all", "critical", "high", "medium", "low"];

function IncidentTimeline() {
  const [filter, setFilter] = useState<RiskLevel | "all">("all");
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

  const rows = incidents.filter((i) => filter === "all" || i.severity === filter);

  useEffect(() => {
    // FIXED: Use environment variable with local fallback
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
    
    setIsLoading(true);
    fetch(`${baseUrl}/incidents`)
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <SectionHeader
        eyebrow="TIMELINE // 24H"
        title="Incident Timeline"
        description="Chronological feed of every detection. Click any event to pivot to the subject investigation."
        actions={
          <div className="flex items-center gap-1 rounded-md border border-border bg-muted/40 p-0.5">
            {filters.map((f) => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 lg:grid-cols-4">
        <div className="space-y-3 lg:col-span-3">
          <div className="glass-panel relative rounded-xl p-6">
            <div className="absolute left-[5.25rem] top-6 bottom-6 w-px bg-border" />
            
            {/* FIXED: Added Loading State for slow cold-starts on Render */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="font-mono text-xs uppercase tracking-wider">Parsing Log Files...</span>
              </div>
            ) : rows.length === 0 ? (
              <div className="text-center py-12 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                No incidents detected for filter: {filter}
              </div>
            ) : (
              <ul className="space-y-5">
                {rows.map((inc) => (
                  <li key={inc.id} className="relative grid grid-cols-[5rem_auto_1fr_auto] items-start gap-4">
                    <div className="font-mono text-[11px] tabular-nums text-muted-foreground">{inc.time}</div>
                    <span 
                      className="mt-1.5 h-3 w-3 rounded-full ring-2 ring-background"
                      style={{ background: inc.severity === "critical" ? "var(--critical)" : inc.severity === "high" ? "var(--warning)" : inc.severity === "medium" ? "var(--info)" : "var(--success)" }} 
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <RiskBadge level={inc.severity} />
                        <span className="text-sm font-medium">{inc.type}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{inc.id}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{inc.description}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        <span>src: {inc.source}</span>
                        <span>subject: <Link to="/users" className="text-primary hover:underline">{inc.user}</Link></span>
                        <span>status: {inc.status}</span>
                      </div>
                    </div>
                    <button className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest hover:bg-muted">
                      Triage
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="glass-panel rounded-xl p-5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">Live Pulse</div>
            </div>
            <div className="mt-3 space-y-2">
              {[{l:"Critical",v:4,c:"var(--critical)"},{l:"High",v:9,c:"var(--warning)"},{l:"Medium",v:18,c:"var(--info)"},{l:"Low",v:42,c:"var(--success)"}].map((r) => (
                <div key={r.l}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{r.l}</span>
                    <span className="font-mono tabular-nums">{r.v}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${r.v * 2}%`, background: r.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">Top Sources</div>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs">
              {["EDR Sensor", "Identity Provider", "DLP Engine", "WAF", "Email Gateway"].map((s, i) => (
                <li key={s} className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1.5">
                  <span>{s}</span><span className="font-mono tabular-nums text-muted-foreground">{[28,22,17,14,9][i]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
