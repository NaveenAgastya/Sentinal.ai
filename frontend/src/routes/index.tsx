import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, ShieldAlert, Users as UsersIcon, Activity, Zap, Eye } from "lucide-react";
import { attackVectors, incidents, riskDistribution, trendData, users } from "@/lib/mock-data";
import { RiskBadge, RiskScore } from "@/components/risk-badge";
import { SectionHeader } from "@/components/section-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — Sentinel AI" },
      { name: "description", content: "Real-time security posture, risk telemetry, and active incidents at a glance." },
      { property: "og:title", content: "Executive Dashboard — Sentinel AI" },
      { property: "og:description", content: "Real-time security posture, risk telemetry, and active incidents." },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Risk Posture", value: "72", unit: "/100", delta: "+4", trend: "up", icon: ShieldAlert, tone: "critical" as const },
  { label: "Active Incidents", value: "23", unit: "", delta: "+6", trend: "up", icon: Zap, tone: "warning" as const },
  { label: "Users Monitored", value: "8,412", unit: "", delta: "+1.2%", trend: "up", icon: UsersIcon, tone: "info" as const },
  { label: "MTTR", value: "11", unit: "min", delta: "-23%", trend: "down", icon: Activity, tone: "success" as const },
];

const toneColor = {
  critical: "var(--critical)",
  warning: "var(--warning)",
  info: "var(--info)",
  success: "var(--success)",
};

function Dashboard() {
  const top = users.slice(0, 5);
  const recent = incidents.slice(0, 5);

  return (
    <div className="grid-bg">
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <SectionHeader
          eyebrow="LIVE // SOC OVERVIEW"
          title="Executive Dashboard"
          description="Aggregated risk, telemetry, and AI triage across the global perimeter."
          actions={
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success pulse-critical" />
              Streaming · last sync 2s ago
            </div>
          }
        />

        {/* KPI tiles */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="glass-panel relative overflow-hidden rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tabular-nums" style={{ color: toneColor[k.tone] }}>{k.value}</span>
                    <span className="text-sm text-muted-foreground">{k.unit}</span>
                  </div>
                </div>
                <div className="rounded-md p-1.5 ring-1 ring-inset" style={{ background: `color-mix(in oklab, ${toneColor[k.tone]} 12%, transparent)`, color: toneColor[k.tone], borderColor: toneColor[k.tone] }}>
                  <k.icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <ArrowUpRight className="h-3 w-3" />
                <span>{k.delta} vs 24h</span>
              </div>
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl" style={{ background: toneColor[k.tone] }} />
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="glass-panel rounded-xl p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Threat Telemetry · 7d</div>
                <div className="mt-0.5 text-sm font-medium">Detections by severity</div>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                <Legend dot="var(--critical)" label="Critical" />
                <Legend dot="var(--warning)" label="High" />
                <Legend dot="var(--info)" label="Medium" />
                <Legend dot="var(--success)" label="Low" />
              </div>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    {(["critical","high","medium","low"] as const).map((k, i) => {
                      const c = [toneColor.critical, toneColor.warning, toneColor.info, toneColor.success][i];
                      return (
                        <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={c} stopOpacity={0.6} />
                          <stop offset="100%" stopColor={c} stopOpacity={0} />
                        </linearGradient>
                      );
                    })}
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="low" stackId="1" stroke={toneColor.success} fill="url(#g-low)" />
                  <Area type="monotone" dataKey="medium" stackId="1" stroke={toneColor.info} fill="url(#g-medium)" />
                  <Area type="monotone" dataKey="high" stackId="1" stroke={toneColor.warning} fill="url(#g-high)" />
                  <Area type="monotone" dataKey="critical" stackId="1" stroke={toneColor.critical} fill="url(#g-critical)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Risk Distribution</div>
            <div className="mt-0.5 text-sm font-medium">Active risk inventory</div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2} stroke="var(--card)">
                    {riskDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {riskDistribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} />
                    <span className="text-xs">{d.name}</span>
                  </div>
                  <span className="font-mono text-xs tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="glass-panel rounded-xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Attack Vectors</div>
                <div className="mt-0.5 text-sm font-medium">Last 24 hours</div>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attackVectors} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="vector" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Top High-Risk Users</div>
                <div className="mt-0.5 text-sm font-medium">Prioritized by AI risk score</div>
              </div>
              <Link to="/users" className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline">View all →</Link>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left">User</th>
                    <th className="px-3 py-2 text-left">Dept</th>
                    <th className="px-3 py-2 text-left">Risk</th>
                    <th className="px-3 py-2 text-left">Level</th>
                    <th className="px-3 py-2 text-right">Alerts</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {top.map((u) => (
                    <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-3 py-2"><div className="font-medium">{u.name}</div><div className="font-mono text-[10px] text-muted-foreground">{u.id}</div></td>
                      <td className="px-3 py-2 text-muted-foreground">{u.department}</td>
                      <td className="px-3 py-2"><RiskScore score={u.riskScore} /></td>
                      <td className="px-3 py-2"><RiskBadge level={u.riskLevel} /></td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums">{u.alerts}</td>
                      <td className="px-3 py-2 text-right">
                        <Link to="/users/$userId" params={{ userId: u.id }} className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] uppercase tracking-widest hover:bg-muted">
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

        {/* Live incidents */}
        <div className="mt-3 glass-panel rounded-xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Live Incident Feed</div>
              <div className="mt-0.5 text-sm font-medium">Most recent alerts</div>
            </div>
            <Link to="/incidents" className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline">Open timeline →</Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((inc) => (
              <li key={inc.id} className="flex items-center gap-4 py-2.5">
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{inc.time}</span>
                <RiskBadge level={inc.severity} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{inc.type}</div>
                  <div className="truncate font-mono text-[11px] text-muted-foreground">{inc.id} · {inc.source} · {inc.user}</div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{inc.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-sm" style={{ background: dot }} />
      {label}
    </span>
  );
}
