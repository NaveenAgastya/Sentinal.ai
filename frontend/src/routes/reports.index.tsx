import { createFileRoute, Link } from "@tanstack/react-router";
import { reports } from "@/lib/mock-data";
import { RiskBadge } from "@/components/risk-badge";
import { SectionHeader } from "@/components/section-header";
import { FileText, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "AI Investigation Reports — Sentinel AI" },
      { name: "description", content: "AI-generated investigation reports with confidence scoring." },
    ],
  }),
  component: ReportsIndex,
});

function ReportsIndex() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <SectionHeader eyebrow="AI ANALYST // REPORTS" title="Investigation Reports" description="Sentinel synthesizes evidence into analyst-grade narratives." />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <Link key={r.id} to="/reports/$reportId" params={{ reportId: r.id }} className="glass-panel group rounded-xl p-5 transition hover:border-primary/50">
            <div className="flex items-start justify-between">
              <RiskBadge level={r.severity} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.id}</span>
            </div>
            <div className="mt-3 flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold leading-snug">{r.title}</h3>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{r.summary}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Subject: {r.user}</span>
              <span className="inline-flex items-center gap-1 text-primary group-hover:translate-x-0.5 transition">{Math.round(r.confidence*100)}% <ChevronRight className="h-3 w-3" /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
