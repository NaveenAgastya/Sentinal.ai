import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowLeft, Laptop, Lock, Mail, MapPin, ShieldAlert, Globe } from "lucide-react";
import { RiskBadge } from "@/components/risk-badge";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/users/$userId")({
  head: ({ params }) => ({
    meta: [
      { title: `Investigate ${params.userId} — Sentinel AI` },
      { name: "description", content: "Per-user investigation surface with behavior signals, timeline, and AI assessment." },
    ],
  }),
  // Keep TanStack loader clean or remove if purely using client-side fetch
  loader: ({ params }) => {
    return { userId: params.userId };
  },
  component: UserInvestigation,
  notFoundComponent: () => <div className="p-8 text-sm text-muted-foreground">User not found.</div>,
});

const behavior = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  score: Math.max(10, Math.round(40 + Math.sin(i / 3) * 18 + (i > 18 ? 35 : 0) + Math.random() * 12)),
}));

function UserInvestigation() {
  const { userId } = Route.useParams();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        // Map backend snake_case / missing fields to what your UI expects
        const mappedUser = {
          id: data.user_id,
          name: data.username || "Unknown User",
          email: `${data.username || "user"}@company.com`, // Fallback strategy
          location: data.location || "Remote / Unknown",
          device: data.device || "Corporate Laptop",
          department: data.department || "Unassigned",
          riskLevel: data.riskLevel || "high", 
          riskScore: data.riskScore || 78, // Fallback if API missing score
          riskFactors: data.riskFactors || [],
          activityCount: data.activityCount || 0
        };
        setDetails(mappedUser);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div className="p-10 text-white">Loading user...</div>;
  }

  if (!details) {
    return <div className="p-10 text-white">No data found for this session.</div>;
  }

  // Generate clean initials from the username
  const initials = details.name.substring(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <Link to="/users" className="mb-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Back to queue
      </Link>

      {/* Header card */}
      <div className="glass-panel scan-line rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/50 to-chart-5/50 text-lg font-semibold uppercase ring-1 ring-border">
              {initials}
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Subject // {details.id}</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{details.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {details.email}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {details.location}</span>
                <span className="inline-flex items-center gap-1"><Laptop className="h-3 w-3" /> {details.device}</span>
                <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" /> {details.department}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RiskBadge level={details.riskLevel} />
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Composite Risk</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tabular-nums text-critical">{details.riskScore}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-critical px-3 py-2 text-xs font-medium text-critical-foreground hover:opacity-90">
              <Lock className="h-3.5 w-3.5" /> Contain Session
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Behavior chart */}
        <div className="glass-panel rounded-xl p-5 lg:col-span-2">
          <div className="mb-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Behavioral risk · 24h</div>
            <div className="mt-0.5 text-sm font-medium">Score over time</div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={behavior}>
                <defs>
                  <linearGradient id="ub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--critical)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--critical)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} interval={2} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="var(--critical)" fill="url(#ub)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signals */}
        <div className="glass-panel rounded-xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-warning" />
            <div className="text-sm font-medium">Contributing Signals</div>
          </div>
          <ul className="space-y-3">
            {details.riskFactors?.map((factor: string, index: number) => (
              <li key={index}>
                <div className="rounded-md border border-border p-3">
                  <div className="text-sm">⚠️ {factor}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-border p-3">
        <div className="text-xs text-muted-foreground">Total Activities</div>
        <div className="text-2xl font-bold">{details.activityCount}</div>
      </div>
    </div>
  );
}
