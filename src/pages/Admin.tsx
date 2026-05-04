import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NfcPanel } from '@/components/admin/NfcPanel';
import { LogsPanel } from '@/components/admin/LogsPanel';
import { ReportSection } from '@/components/admin/ReportSection';

const Admin = () => {
  const [counts, setCounts] = useState({ total: 0, alarm: 0, unauth: 0, access: 0 });

  return (
    <div className="min-h-screen bg-background p-4 pb-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ESPGUARD Admin</h1>
            <p className="text-sm text-muted-foreground">Manage NFC access, logs, and reports</p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Monitor
            </Link>
          </Button>
        </div>

        <ReportSection counts={counts} />

        <div className="grid gap-4 lg:grid-cols-2">
          <NfcPanel />
          <LogsPanel onCounts={setCounts} />
        </div>
      </div>
    </div>
  );
};

export default Admin;
