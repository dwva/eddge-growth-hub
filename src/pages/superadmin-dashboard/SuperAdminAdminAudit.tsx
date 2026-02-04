import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { superAdminAuditApi, type AdminActionLogEntry } from '@/services/superAdminApi';
import { Shield, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';

const ACTION_TYPES = [
  'FEATURE_TOGGLE',
  'FEATURE_ROLLOUT_UPDATE',
  'FEATURE_BETA_UPDATE',
  'ALERT_UPDATE',
] as const;

const SuperAdminAdminAudit = () => {
  const [page, setPage] = useState(1);
  const [actorFilter, setActorFilter] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');

  const { data, isLoading, isError, refetch, isRefetching } = useQuery<{
    logs: AdminActionLogEntry[];
    total: number;
  }>({
    queryKey: ['superadmin', 'admin-audit', page, actorFilter, actionFilter],
    queryFn: () =>
      superAdminAuditApi.getAdminActions(page, 25, actorFilter || undefined, actionFilter || undefined),
  });

  const formatTimestamp = (ts: string) => new Date(ts).toLocaleString();

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SuperAdmin Action Audit</h1>
            <p className="text-muted-foreground">
              Immutable log of configuration changes performed by SuperAdmins.
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
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="py-3 flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Audit logs are immutable and required for compliance.
              </p>
              <p className="text-xs text-amber-800">
                This view is read-only. SuperAdmin actions from Phase 2 modules (feature flags, alerts, lifecycle, exports, AI guardrails) appear here.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filters + Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Search and filter SuperAdmin configuration changes.</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter by actor email..."
                    className="pl-8 w-56"
                    value={actorFilter}
                    onChange={(e) => {
                      setActorFilter(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <Select
                  value={actionFilter}
                  onValueChange={(value) => {
                    setActionFilter(value === 'ALL' ? '' : value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All actions</SelectItem>
                    {ACTION_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading admin audit logs..." />
            ) : isError ? (
              <EmptyState
                icon={AlertCircle}
                title="Failed to load audit logs"
                description="Please try refreshing the page."
                action={
                  <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" /> Retry
                  </Button>
                }
              />
            ) : !data || data.logs.length === 0 ? (
              <EmptyState
                icon={Shield}
                title="No SuperAdmin actions recorded yet"
                description="Once configuration changes are made in Phase 2 modules, they will appear here."
              />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Metadata</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.logs.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {entry.actor}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {entry.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {entry.target}
                        </TableCell>
                        <TableCell className="text-xs max-w-xs truncate">
                          {entry.metadata || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {data.total > 25 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Page {page} of {Math.ceil(data.total / 25)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page * 25 >= data.total}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminAdminAudit;


