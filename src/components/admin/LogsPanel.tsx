import { useEffect, useMemo, useState } from 'react';
import { supabase, EspguardLog } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type Filter = 'ALL' | 'ALARM' | 'UNAUTH' | 'ACCESS';

interface LogsPanelProps {
  onCounts?: (counts: { total: number; alarm: number; unauth: number; access: number }) => void;
}

export const LogsPanel = ({ onCounts }: LogsPanelProps) => {
  const [logs, setLogs] = useState<EspguardLog[]>([]);
  const [filter, setFilter] = useState<Filter>('ALL');

  const load = async () => {
    const { data } = await supabase
      .from('espguard_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(200);
    setLogs((data as EspguardLog[]) || []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel('espguard_logs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'espguard_logs' }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const counts = useMemo(() => {
    const c = { total: logs.length, alarm: 0, unauth: 0, access: 0 };
    for (const l of logs) {
      const t = (l.event_type || '').toUpperCase();
      if (t === 'ALARM') c.alarm++;
      else if (t === 'UNAUTH') c.unauth++;
      else if (t === 'ACCESS') c.access++;
    }
    return c;
  }, [logs]);

  useEffect(() => {
    onCounts?.(counts);
  }, [counts, onCounts]);

  const filtered = filter === 'ALL' ? logs : logs.filter((l) => (l.event_type || '').toUpperCase() === filter);

  const variantFor = (t: string) => {
    const u = t.toUpperCase();
    if (u === 'ALARM' || u === 'UNAUTH') return 'destructive' as const;
    if (u === 'ACCESS') return 'default' as const;
    return 'secondary' as const;
  };

  const filters: Filter[] = ['ALL', 'ALARM', 'UNAUTH', 'ACCESS'];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">Logs</h3>
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
              className={cn('h-7 px-3 text-xs')}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>
      <ScrollArea className="h-[420px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>UID</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                  No logs
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <Badge variant={variantFor(l.event_type)}>{l.event_type}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{l.uid || '—'}</TableCell>
                  <TableCell className="text-xs">{l.device || '—'}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(l.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
