import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminIncidentsApi, superAdminAuditApi, type Incident } from '@/services/superAdminApi';
import { AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import { LoadingState } from '@/components/shared/LoadingState';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const SuperAdminIncidents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, refetch } = useQuery<Incident[]>({
    queryKey: ['superadmin', 'incidents'],
    queryFn: () => superAdminIncidentsApi.getIncidents(),
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<Incident['severity']>('medium');
  const [summary, setSummary] = useState('');

  const logAction = async (action: string, target: string, metadata?: string) => {
    try {
      await superAdminAuditApi.logAdminAction({
        actor: user?.email || 'superadmin@eddge.com',
        action,
        target,
        metadata,
      });
    } catch {
      // ignore
    }
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const incident = await superAdminIncidentsApi.logIncident({ title, severity, summary });
      await logAction('INCIDENT_LOG', incident.id, `severity=${severity}`);
      return incident;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'incidents'] });
      setCreateOpen(false);
      setTitle('');
      setSummary('');
      setSeverity('medium');
    },
  });

  const notesMutation = useMutation({
    mutationFn: async () => {
      if (!selectedIncident) return;
      await superAdminIncidentsApi.addResolutionNotes(selectedIncident.id, notesValue);
      await logAction('INCIDENT_RESOLUTION_NOTES', selectedIncident.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'incidents'] });
      setNotesOpen(false);
      setNotesValue('');
    },
  });

  const closeMutation = useMutation({
    mutationFn: async (incident: Incident) => {
      await superAdminIncidentsApi.closeIncident(incident.id);
      await logAction('INCIDENT_CLOSE', incident.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'incidents'] });
    },
  });

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-3 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">Incidents</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Manually log, track, and annotate platform incidents. Entries are audited and immutable after closure.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Log Incident
            </Button>
          </div>
        </div>

        {/* Banner */}
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="py-3 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Manual entry only. No automatic actions.
              </p>
              <p className="text-xs text-amber-800">
                Incidents are logged manually and do not trigger automatic mitigations. Once closed, incidents are immutable.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Incident List</CardTitle>
            <CardDescription>Recent production incidents and their status.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading incidents..." />
            ) : !data || data.length === 0 ? (
              <p className="text-sm text-muted-foreground">No incidents logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Closed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell className="font-medium">{inc.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inc.severity === 'high'
                              ? 'destructive'
                              : inc.severity === 'medium'
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {inc.severity.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={inc.status === 'open' ? 'default' : 'secondary'}>
                          {inc.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(inc.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {inc.closed_at ? new Date(inc.closed_at).toLocaleString() : '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedIncident(inc);
                              setNotesOpen(true);
                            }}
                            disabled={inc.status === 'closed'}
                          >
                            Notes
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => closeMutation.mutate(inc)}
                            disabled={inc.status === 'closed'}
                          >
                            Close
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Incident Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Log Incident</DialogTitle>
              <DialogDescription>
                Create a new platform incident entry. This is manual tracking only; no automatic remediation is performed.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="incident-title">Title</Label>
                <Input
                  id="incident-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <div className="flex gap-2 text-xs">
                  {(['low', 'medium', 'high'] as Incident['severity'][]).map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant={severity === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSeverity(s)}
                    >
                      {s.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-summary">Summary</Label>
                <Textarea
                  id="incident-summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => createMutation.mutate()}
                  disabled={!title || !summary || createMutation.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Resolution Notes Dialog */}
        <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Resolution Notes</DialogTitle>
              <DialogDescription>
                Add or update resolution notes for <span className="font-semibold">{selectedIncident?.title}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setNotesOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => notesMutation.mutate()}
                  disabled={!notesValue || notesMutation.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminIncidents;


