import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminSupportApi, superAdminIncidentsApi, superAdminAuditApi, type SupportEscalation, type Incident } from '@/services/superAdminApi';
import { LoadingState } from '@/components/shared/LoadingState';
import { Headphones, Link2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

const SuperAdminSupport = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: escalations, isLoading: escLoading, isRefetching, refetch } = useQuery<SupportEscalation[]>({
    queryKey: ['superadmin', 'support-escalations'],
    queryFn: () => superAdminSupportApi.getEscalations(),
  });

  const { data: incidents } = useQuery<Incident[]>({
    queryKey: ['superadmin', 'incidents'],
    queryFn: () => superAdminIncidentsApi.getIncidents(),
  });

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<SupportEscalation | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');

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

  const severityMutation = useMutation({
    mutationFn: async ({ escalation, severity }: { escalation: SupportEscalation; severity: SupportEscalation['severity'] }) => {
      await superAdminSupportApi.tagSeverity(escalation.id, severity);
      await logAction('SUPPORT_ESCALATION_SEVERITY', escalation.id, `severity=${severity}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'support-escalations'] });
    },
  });

  const linkMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEscalation || !selectedIncidentId) return;
      await superAdminSupportApi.linkIncident(selectedEscalation.id, selectedIncidentId);
      await logAction('SUPPORT_ESCALATION_LINK_INCIDENT', selectedEscalation.id, `incident=${selectedIncidentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'support-escalations'] });
      setLinkDialogOpen(false);
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (esc: SupportEscalation) => {
      await superAdminSupportApi.markResolved(esc.id);
      await logAction('SUPPORT_ESCALATION_RESOLVE', esc.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'support-escalations'] });
    },
  });

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support &amp; Escalations</h1>
            <p className="text-muted-foreground">
              Internal view of escalated tickets, with severity tags and links to incidents. No direct messaging to schools.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Banner */}
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="py-3 flex items-start gap-3">
            <Headphones className="h-5 w-5 text-slate-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">
                Internal view only. Read-mostly.
              </p>
              <p className="text-xs text-slate-800">
                Escalations shown here are for internal coordination. No direct communication to schools is performed from this view.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Escalations table */}
        <Card>
          <CardHeader>
            <CardTitle>Escalations</CardTitle>
            <CardDescription>Latest high-priority or complex tickets requiring SuperAdmin visibility.</CardDescription>
          </CardHeader>
          <CardContent>
            {escLoading ? (
              <LoadingState message="Loading escalations..." />
            ) : !escalations || escalations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No escalations currently open.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Linked Incident</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escalations.map((esc) => (
                    <TableRow key={esc.id}>
                      <TableCell className="font-medium">{esc.schoolName}</TableCell>
                      <TableCell>{esc.subject}</TableCell>
                      <TableCell>
                        <Select
                          value={esc.severity}
                          onValueChange={(value) =>
                            severityMutation.mutate({ escalation: esc, severity: value as SupportEscalation['severity'] })
                          }
                        >
                          <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant={esc.status === 'open' ? 'default' : 'secondary'}>
                          {esc.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {esc.linkedIncidentId || '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEscalation(esc);
                              setSelectedIncidentId(esc.linkedIncidentId || '');
                              setLinkDialogOpen(true);
                            }}
                          >
                            <Link2 className="mr-1 h-4 w-4" />
                            Incident
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => resolveMutation.mutate(esc)}
                            disabled={esc.status === 'resolved'}
                          >
                            Mark Resolved
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Link Incident Dialog */}
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Link Incident</DialogTitle>
              <DialogDescription>
                Link escalation{' '}
                <span className="font-semibold">{selectedEscalation?.subject}</span> to an existing incident.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                value={selectedIncidentId}
                onValueChange={setSelectedIncidentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select incident" />
                </SelectTrigger>
                <SelectContent>
                  {incidents?.map((inc) => (
                    <SelectItem key={inc.id} value={inc.id}>
                      {inc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setLinkDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => linkMutation.mutate()}
                  disabled={!selectedIncidentId || linkMutation.isPending}
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

export default SuperAdminSupport;


