import { Activity, AlertTriangle, ShieldAlert, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportSectionProps {
  counts: { total: number; alarm: number; unauth: number; access: number };
}

const Card = ({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Activity;
  accent: string;
}) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <Icon className={cn('h-4 w-4', accent)} />
    </div>
    <div className="mt-2 text-3xl font-bold">{value}</div>
  </div>
);

export const ReportSection = ({ counts }: ReportSectionProps) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
    <Card label="Total Logs" value={counts.total} icon={Activity} accent="text-muted-foreground" />
    <Card label="Alarms" value={counts.alarm} icon={AlertTriangle} accent="text-status-motion" />
    <Card label="Unauthorized" value={counts.unauth} icon={ShieldAlert} accent="text-status-service" />
    <Card label="Access" value={counts.access} icon={KeyRound} accent="text-status-active" />
  </div>
);
