import type { RiskLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const styles: Record<RiskLevel, string> = {
  critical: "bg-critical/15 text-critical ring-critical/40",
  high: "bg-warning/15 text-warning ring-warning/40",
  medium: "bg-info/15 text-info ring-info/40",
  low: "bg-success/15 text-success ring-success/40",
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ring-1 ring-inset",
      styles[level],
      className,
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-critical pulse-critical": level === "critical",
        "bg-warning": level === "high",
        "bg-info": level === "medium",
        "bg-success": level === "low",
      })} />
      {level}
    </span>
  );
}

export function RiskScore({ score }: { score: number }) {
  const level: RiskLevel = score >= 85 ? "critical" : score >= 65 ? "high" : score >= 40 ? "medium" : "low";
  const color = level === "critical" ? "var(--critical)" : level === "high" ? "var(--warning)" : level === "medium" ? "var(--info)" : "var(--success)";
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${score}%`, background: color, boxShadow: `0 0 12px ${color}` }} />
      </div>
      <span className="font-mono text-xs tabular-nums" style={{ color }}>{score}</span>
    </div>
  );
}
