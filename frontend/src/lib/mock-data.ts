export type RiskLevel = "critical" | "high" | "medium" | "low";

export interface RiskUser {
  id: string;
  name: string;
  email: string;
  department: string;
  riskScore: number;
  riskLevel: RiskLevel;
  alerts: number;
  lastActivity: string;
  location: string;
  device: string;
  status: "active" | "investigating" | "contained";
}

export interface Incident {
  id: string;
  time: string;
  type: string;
  severity: RiskLevel;
  user: string;
  source: string;
  description: string;
  status: "open" | "investigating" | "resolved";
}

export interface Report {
  id: string;
  title: string;
  user: string;
  generated: string;
  confidence: number;
  severity: RiskLevel;
  summary: string;
}

export const users: RiskUser[] = [
  { id: "u-1042", name: "Marcus Chen", email: "m.chen@corp.io", department: "Finance", riskScore: 94, riskLevel: "critical", alerts: 12, lastActivity: "2m ago", location: "Singapore", device: "MacBook Pro", status: "investigating" },
  { id: "u-0891", name: "Priya Anand", email: "p.anand@corp.io", department: "Engineering", riskScore: 88, riskLevel: "critical", alerts: 9, lastActivity: "8m ago", location: "Berlin", device: "Linux Workstation", status: "active" },
  { id: "u-1156", name: "Jordan Ellis", email: "j.ellis@corp.io", department: "Sales", riskScore: 81, riskLevel: "high", alerts: 7, lastActivity: "23m ago", location: "Austin, TX", device: "Windows 11", status: "active" },
  { id: "u-0773", name: "Yuki Tanaka", email: "y.tanaka@corp.io", department: "Legal", riskScore: 76, riskLevel: "high", alerts: 5, lastActivity: "1h ago", location: "Tokyo", device: "MacBook Air", status: "investigating" },
  { id: "u-1320", name: "Sofia Reyes", email: "s.reyes@corp.io", department: "HR", riskScore: 72, riskLevel: "high", alerts: 6, lastActivity: "1h ago", location: "Mexico City", device: "iPad Pro", status: "active" },
  { id: "u-0654", name: "Daniel Okafor", email: "d.okafor@corp.io", department: "Engineering", riskScore: 68, riskLevel: "high", alerts: 4, lastActivity: "2h ago", location: "Lagos", device: "MacBook Pro", status: "contained" },
  { id: "u-1487", name: "Emma Whitfield", email: "e.whitfield@corp.io", department: "Marketing", riskScore: 61, riskLevel: "medium", alerts: 3, lastActivity: "3h ago", location: "London", device: "Windows 11", status: "active" },
  { id: "u-0928", name: "Ravi Krishnan", email: "r.krishnan@corp.io", department: "IT Ops", riskScore: 58, riskLevel: "medium", alerts: 3, lastActivity: "4h ago", location: "Bangalore", device: "Linux Workstation", status: "active" },
];

export const incidents: Incident[] = [
  { id: "INC-9821", time: "14:32:08", type: "Anomalous data exfiltration", severity: "critical", user: "Marcus Chen", source: "DLP Engine", description: "4.2 GB transferred to unsanctioned cloud storage over TLS.", status: "investigating" },
  { id: "INC-9820", time: "14:18:44", type: "Impossible travel", severity: "critical", user: "Priya Anand", source: "Identity Provider", description: "Auth from Berlin and São Paulo within 11 minutes.", status: "open" },
  { id: "INC-9819", time: "13:51:02", type: "Privilege escalation", severity: "high", user: "Jordan Ellis", source: "EDR Sensor", description: "Local admin elevation via unsigned binary on endpoint.", status: "investigating" },
  { id: "INC-9818", time: "13:22:51", type: "Suspicious OAuth grant", severity: "high", user: "Yuki Tanaka", source: "SaaS Connector", description: "Third-party app granted mailbox.read on 1,200 mailboxes.", status: "open" },
  { id: "INC-9817", time: "12:47:17", type: "Credential stuffing", severity: "medium", user: "Sofia Reyes", source: "WAF", description: "342 failed logins from rotating residential proxies.", status: "resolved" },
  { id: "INC-9816", time: "12:11:39", type: "Lateral movement", severity: "high", user: "Daniel Okafor", source: "Network Sensor", description: "SMB enumeration across 14 internal hosts in 90 seconds.", status: "investigating" },
  { id: "INC-9815", time: "11:38:22", type: "Phishing click", severity: "medium", user: "Emma Whitfield", source: "Email Gateway", description: "User interacted with credential-harvesting landing page.", status: "resolved" },
  { id: "INC-9814", time: "10:55:01", type: "Malware detonation", severity: "critical", user: "Ravi Krishnan", source: "EDR Sensor", description: "Cobalt Strike beacon detected and quarantined.", status: "resolved" },
];

export const reports: Report[] = [
  { id: "RPT-2041", title: "Insider exfiltration via personal cloud", user: "Marcus Chen", generated: "2 minutes ago", confidence: 0.92, severity: "critical", summary: "Coordinated data movement and off-hours access patterns suggest deliberate exfiltration." },
  { id: "RPT-2040", title: "Compromised credential — session hijack likely", user: "Priya Anand", generated: "14 minutes ago", confidence: 0.87, severity: "critical", summary: "Geo-impossible session reuse and anomalous user-agent fingerprint detected." },
  { id: "RPT-2039", title: "Living-off-the-land privilege escalation", user: "Jordan Ellis", generated: "41 minutes ago", confidence: 0.74, severity: "high", summary: "Sequence of LOLBin invocations consistent with Earth Lusca tradecraft." },
];

export function getUser(id: string) {
  return users.find((u) => u.id === id) ?? users[0];
}

export function getReport(id: string) {
  return reports.find((r) => r.id === id) ?? reports[0];
}

export const trendData = [
  { day: "Mon", critical: 4, high: 12, medium: 28, low: 64 },
  { day: "Tue", critical: 6, high: 14, medium: 32, low: 58 },
  { day: "Wed", critical: 3, high: 9, medium: 25, low: 71 },
  { day: "Thu", critical: 8, high: 18, medium: 36, low: 54 },
  { day: "Fri", critical: 11, high: 22, medium: 41, low: 49 },
  { day: "Sat", critical: 5, high: 11, medium: 22, low: 38 },
  { day: "Sun", critical: 7, high: 15, medium: 29, low: 47 },
];

export const riskDistribution = [
  { name: "Critical", value: 18, color: "var(--critical)" },
  { name: "High", value: 47, color: "var(--warning)" },
  { name: "Medium", value: 128, color: "var(--info)" },
  { name: "Low", value: 412, color: "var(--success)" },
];

export const attackVectors = [
  { vector: "Phishing", count: 84 },
  { vector: "Credential", count: 67 },
  { vector: "Insider", count: 41 },
  { vector: "Malware", count: 38 },
  { vector: "Supply Chain", count: 22 },
  { vector: "Misconfig", count: 19 },
];
