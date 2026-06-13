import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BrainCircuit, CheckCircle2, Download, FileText, Share2, Sparkles } from "lucide-react";
import { getReport } from "@/lib/mock-data";
import { RiskBadge } from "@/components/risk-badge";

export const Route = createFileRoute("/reports/$reportId")({
  head: ({ params }) => ({
    meta: [
      { title: `Report ${params.reportId} — Sentinel AI` },
      { name: "description", content: "AI-generated investigation report with timeline, evidence, and recommended actions." },
    ],
  }),
  loader: ({ params }) => ({ report: getReport(params.reportId) }),
  component: ReportPage,
});

const sections = [
  {
    title: "Executive Summary",
    body: "Subject exhibits a high-confidence pattern consistent with deliberate data exfiltration. Across the past 72 hours, Sentinel observed converging signals: off-hours authentication from a new geography, an 6.1× spike in outbound data volume, and use of unsanctioned cloud storage. No collaborator overlap explains the behavior. Recommend immediate session containment and HR/Legal escalation.",
  },
  {
    title: "Key Findings",
    bullets: [
      "Transferred 4.2 GB to a personal Dropbox endpoint over TLS, bypassing CASB inspection via OAuth refresh token.",
      "Authentication from Singapore at 03:14 UTC; no travel ticket on file and last known location is Berlin.",
      "Bulk-downloaded 1,247 documents from the Finance SharePoint between 21:00–23:00 over four consecutive nights.",
      "Disabled endpoint backup agent and cleared local browser history twice in 24 hours.",
    ],
  },
  {
    title: "Adversary Tradecraft Alignment",
    body: "Behavior maps to MITRE ATT&CK techniques T1567.002 (Exfiltration to Cloud Storage), T1078 (Valid Accounts), and T1070.004 (Indicator Removal). Pacing and OPSEC discipline suggest an informed insider rather than commodity malware.",
  },
];

const actions = [
  { label: "Revoke active sessions and rotate credentials", priority: "critical" as const },
  { label: "Quarantine endpoint and image disk for forensics", priority: "critical" as const },
  { label: "Engage HR and Legal under insider-threat playbook IT-04", priority: "high" as const },
  { label: "Issue CASB block on personal Dropbox tenant", priority: "high" as const },
  { label: "Expand monitoring on Finance department peer group", priority: "medium" as const },
];

function ReportPage() {
  const { report } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <Link to="/reports" className="mb-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> All reports
      </Link>

      {/* Header */}
      <div className="glass-panel scan-line rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <RiskBadge level={report.severity} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{report.id}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary ring-1 ring-inset ring-primary/30">
                <Sparkles className="h-3 w-3" /> AI-generated
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{report.title}</h1>
            <div className="mt-1 font-mono text-[11px] text-muted-foreground">
              Subject: {report.user} · Generated {report.generated}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs hover:bg-muted">
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
              <Download className="h-3.5 w-3.5" /> Export PDF
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Confidence" value={`${Math.round(report.confidence * 100)}%`} accent="var(--primary)" />
          <Stat label="Severity" value={report.severity.toUpperCase()} accent="var(--critical)" />
          <Stat label="Signals Fused" value="38" accent="var(--info)" />
          <Stat label="Time to Insight" value="4.2s" accent="var(--success)" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Body */}
        <article className="glass-panel space-y-6 rounded-xl p-6 lg:col-span-2">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                <FileText className="h-3.5 w-3.5" /> {s.title}
              </h2>
              {s.body && <p className="mt-2 text-sm leading-relaxed text-foreground/90">{s.body}</p>}
              {s.bullets && (
                <ul className="mt-2 space-y-1.5">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground/90">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
              <BrainCircuit className="h-3.5 w-3.5" /> Analyst Notes
            </h2>
            <div className="mt-2 rounded-lg border border-dashed border-border bg-muted/20 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
              {">"} Cross-reference with Finance access reviews from Q2.{"\n"}
              {">"} Confirm Singapore IP belongs to commercial residential proxy pool.{"\n"}
              {">"} Pending: pull Slack DMs for collaborator overlap (legal hold approved).
            </div>
          </section>
        </article>

        {/* Actions */}
        <aside className="space-y-3">
          <div className="glass-panel rounded-xl p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <div className="text-sm font-medium">Recommended Actions</div>
            </div>
            <ul className="mt-3 space-y-2">
              {actions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 rounded-md border border-border bg-muted/30 p-2.5">
                  <RiskBadge level={a.priority} className="mt-0.5" />
                  <span className="text-xs leading-snug">{a.label}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full rounded-md bg-critical px-3 py-2 text-xs font-medium text-critical-foreground hover:opacity-90">
              Execute Containment Playbook
            </button>
          </div>

          <div className="glass-panel rounded-xl p-5">
            <div className="text-sm font-medium">Evidence Chain</div>
            <ul className="mt-3 space-y-1.5 font-mono text-[11px] text-muted-foreground">
              <li className="flex justify-between"><span>edr.events</span><span className="text-foreground">2,481</span></li>
              <li className="flex justify-between"><span>idp.auth</span><span className="text-foreground">147</span></li>
              <li className="flex justify-between"><span>dlp.flows</span><span className="text-foreground">38</span></li>
              <li className="flex justify-between"><span>saas.audit</span><span className="text-foreground">612</span></li>
              <li className="flex justify-between"><span>net.netflow</span><span className="text-foreground">19,204</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums" style={{ color: accent }}>{value}</div>
    </div>
  );
}
