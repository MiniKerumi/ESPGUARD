import { ScrollArea } from "@/components/ui/scroll-area";
import { LogEntry } from "@/hooks/useBluetooth";
import { cn } from "@/lib/utils";

interface ActivityLogProps {
  logs: LogEntry[];
}

export const ActivityLog = ({ logs }: ActivityLogProps) => {
  const getStateColor = (state?: string) => {
    switch (state) {
      case 'NORMAL':
        return 'text-status-active';
      case 'MAINT':
        return 'text-status-service';
      case 'ALARM':
        return 'text-status-motion';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-status-motion/10 border-l-2 border-l-status-motion';
      case 'warning':
        return 'bg-status-service/10 border-l-2 border-l-status-service';
      default:
        return 'bg-secondary/50';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-4 text-lg font-semibold">Activity Log</h3>
      <ScrollArea className="h-64">
        <div className="space-y-2">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet</p>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={cn("rounded-lg p-3 text-sm", getSeverityBg(log.severity))}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={cn("font-medium", getStateColor(log.state))}>
                    {log.message}
                  </span>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
