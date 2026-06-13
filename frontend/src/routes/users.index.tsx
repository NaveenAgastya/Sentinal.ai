import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { ArrowUpDown, Eye, Filter, Search } from "lucide-react";
import { users, type RiskLevel } from "@/lib/mock-data";
import { RiskBadge, RiskScore } from "@/components/risk-badge";
import { SectionHeader } from "@/components/section-header";

export const Route = createFileRoute("/users/")({
  head: () => ({
    meta: [
      { title: "High-Risk Users — Sentinel AI" },
      { name: "description", content: "AI-prioritized list of users with elevated behavioral and identity risk." },
      { property: "og:title", content: "High-Risk Users — Sentinel AI" },
      { property: "og:description", content: "Triage and investigate users with elevated risk scores." },
    ],
  }),
  component: UsersPage,
});

const levels: (RiskLevel | "all")[] = ["all", "critical", "high", "medium", "low"];

function UsersPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<RiskLevel | "all">("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
  fetch("https://sentinal-ai-0mt0.onrender.com/users")
    .then((res) => res.json())
    .then((data) => {
      setUsers(data);
    })
    .catch((err) => console.error(err));
}, []);

  const rows = useMemo(() => {
    return users
      .filter((u) => filter === "all" || u.riskLevel === filter)
      .filter((u) => !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()) || u.id.includes(q))
      .sort((a, b) => sortDesc ? b.riskScore - a.riskScore : a.riskScore - b.riskScore);
  }, [q, filter, sortDesc]);

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <SectionHeader
        eyebrow="USER RISK // QUEUE"
        title="High-Risk Users"
        description="Prioritized by Sentinel's behavioral graph and identity-risk scoring engine."
      />

      <div className="glass-panel rounded-xl">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search user, email, ID…"
              className="h-8 w-72 rounded-md border border-border bg-muted/40 pl-8 pr-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-muted/40 p-0.5">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setFilter(l)}
                className={`rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition ${filter === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="ml-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Filter className="h-3 w-3" /> {rows.length} of {users.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left">User</th>
                <th className="px-4 py-2.5 text-left">Department</th>
                <th className="px-4 py-2.5 text-left">Location</th>
                <th className="px-4 py-2.5 text-left">
                  <button onClick={() => setSortDesc((s) => !s)} className="inline-flex items-center gap-1 hover:text-foreground">
                    Risk Score <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-2.5 text-left">Level</th>
                <th className="px-4 py-2.5 text-right">Alerts</th>
                <th className="px-4 py-2.5 text-left">Status</th>
                <th className="px-4 py-2.5 text-left">Last Activity</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-t border-border transition hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-chart-5/40 font-mono text-[10px] font-semibold uppercase">
                        {u.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.department}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{u.location}</td>
                  <td className="px-4 py-3"><RiskScore score={u.riskScore} /></td>
                  <td className="px-4 py-3"><RiskBadge level={u.riskLevel} /></td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{u.alerts}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{u.status}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{u.lastActivity}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to="/users/$userId" params={{ userId: u.id }} className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/20">
                      <Eye className="h-3 w-3" /> Investigate
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
