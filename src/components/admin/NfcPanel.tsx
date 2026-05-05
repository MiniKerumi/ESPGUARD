import { useEffect, useState } from 'react';
import { Plus, Shield, ShieldOff, RefreshCw } from 'lucide-react';
import { supabase, AuthorizedNfc } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useBluetoothContext } from '@/contexts/BluetoothContext';

export const NfcPanel = () => {
  const [rows, setRows] = useState<AuthorizedNfc[]>([]);
  const [open, setOpen] = useState(false);
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data, error } = await supabase
      .from('authorized_nfc')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error loading NFC', description: error.message, variant: 'destructive' });
      return;
    }
    setRows((data as AuthorizedNfc[]) || []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel('authorized_nfc_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'authorized_nfc' }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const addNfc = async () => {
    if (!uid.trim() || !name.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from('authorized_nfc')
      .insert({ uid: uid.trim(), name: name.trim(), status: 'ACTIVE' });
    setLoading(false);
    if (error) {
      toast({ title: 'Insert failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'NFC added', description: `${name} (${uid})` });
    setUid('');
    setName('');
    setOpen(false);
    load();
  };

  const toggleStatus = async (row: AuthorizedNfc) => {
    const next = row.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const { error } = await supabase.from('authorized_nfc').update({ status: next }).eq('id', row.id);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      return;
    }
    load();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Authorized NFC</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add NFC
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Authorized NFC</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>UID</Label>
                <Input value={uid} onChange={(e) => setUid(e.target.value)} placeholder="04:A2:B1:..." />
              </div>
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addNfc} disabled={loading}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                  No authorized NFC tags
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.uid}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'ACTIVE' ? 'default' : 'destructive'}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => toggleStatus(r)}>
                      {r.status === 'ACTIVE' ? <ShieldOff className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                      {r.status === 'ACTIVE' ? 'Block' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
