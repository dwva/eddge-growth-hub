import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { superAdminExportApi, superAdminAuditApi, type UsageExportSummary, type BillingExportSummary, type SchoolRegistryExportSummary } from '@/services/superAdminApi';
import { Download, BarChart2, CreditCard, School } from 'lucide-react';
import { LoadingState } from '@/components/shared/LoadingState';
import { useAuth } from '@/contexts/AuthContext';

const triggerDownload = (filename: string, rows: Record<string, unknown>[]) => {
  const header = rows.length ? Object.keys(rows[0]) : [];
  const csv =
    header.join(',') +
    '\n' +
    rows
      .map((row) =>
        header
          .map((key) => {
            const value = row[key] ?? '';
            const str = String(value).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(',')
      )
      .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const SuperAdminExport = () => {
  const { user } = useAuth();

  const { data: usageSummary, isLoading: usageLoading } = useQuery<UsageExportSummary>({
    queryKey: ['superadmin', 'export-usage'],
    queryFn: () => superAdminExportApi.getUsageExportSummary(),
  });

  const { data: billingSummary, isLoading: billingLoading } = useQuery<BillingExportSummary>({
    queryKey: ['superadmin', 'export-billing'],
    queryFn: () => superAdminExportApi.getBillingExportSummary(),
  });

  const { data: schoolSummary, isLoading: schoolLoading } = useQuery<SchoolRegistryExportSummary>({
    queryKey: ['superadmin', 'export-schools'],
    queryFn: () => superAdminExportApi.getSchoolRegistryExportSummary(),
  });

  const logExport = async (target: string, format: string) => {
    try {
      await superAdminAuditApi.logAdminAction({
        actor: user?.email || 'superadmin@eddge.com',
        action: 'EXPORT_AGGREGATE_DATA',
        target,
        metadata: `format=${format}`,
      });
    } catch {
      // ignore logging error for UI
    }
  };

  const exporting = usageLoading || billingLoading || schoolLoading;

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Aggregated Data Export</h1>
          <p className="text-muted-foreground">
            Download platform-level, aggregated datasets for offline analysis. No PII is included.
          </p>
        </div>

        {exporting && <LoadingState message="Preparing export summaries..." />}

        <div className="grid gap-4 md:grid-cols-3">
          {/* Usage Analytics summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Usage Analytics
              </CardTitle>
              <CardDescription>Per-day and aggregate usage trends.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Total users: <span className="font-semibold text-foreground">{usageSummary?.totalUsers ?? '—'}</span></p>
                <p>Total schools: <span className="font-semibold text-foreground">{usageSummary?.totalSchools ?? '—'}</span></p>
                <p>Total AI requests: <span className="font-semibold text-foreground">{usageSummary?.totalRequests ?? '—'}</span></p>
              </div>
              <p className="text-xs text-muted-foreground">
                Aggregated rows only (per-day/per-feature counts). No user- or class-level data.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!usageSummary}
                  onClick={async () => {
                    if (!usageSummary) return;
                    const rows = [
                      {
                        metric: 'total_users',
                        value: usageSummary.totalUsers,
                      },
                      {
                        metric: 'total_schools',
                        value: usageSummary.totalSchools,
                      },
                      {
                        metric: 'total_requests',
                        value: usageSummary.totalRequests,
                      },
                    ];
                    triggerDownload('usage_summary.csv', rows);
                    await logExport('usage_summary', 'csv');
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
                <Badge variant="outline" className="text-[11px]">
                  Aggregated • No PII
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Billing summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Billing Summary
              </CardTitle>
              <CardDescription>Revenue and plan-level aggregates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Monthly revenue (mock): <span className="font-semibold text-foreground">${billingSummary?.totalRevenueMonthly ?? '—'}</span></p>
                <p>Yearly revenue (mock): <span className="font-semibold text-foreground">${billingSummary?.totalRevenueYearly ?? '—'}</span></p>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Plan breakdown:</p>
                  {billingSummary &&
                    Object.entries(billingSummary.planBreakdown).map(([plan, count]) => (
                      <p key={plan} className="text-xs">
                        {plan}: {count} schools
                      </p>
                    ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                School-level billing aggregates only. No invoice line-items or identifying details.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!billingSummary}
                  onClick={async () => {
                    if (!billingSummary) return;
                    const rows = Object.entries(billingSummary.planBreakdown).map(([plan, count]) => ({
                      plan,
                      schools: count,
                    }));
                    triggerDownload('billing_summary.csv', rows);
                    await logExport('billing_summary', 'csv');
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
                <Badge variant="outline" className="text-[11px]">
                  Aggregated • No PII
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* School registry summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                School Registry
              </CardTitle>
              <CardDescription>Plan and lifecycle distribution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Total schools: <span className="font-semibold text-foreground">{schoolSummary?.totalSchools ?? '—'}</span></p>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">By plan:</p>
                  {schoolSummary &&
                    Object.entries(schoolSummary.byPlan).map(([plan, count]) => (
                      <p key={plan} className="text-xs">
                        {plan}: {count}
                      </p>
                    ))}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">By lifecycle state:</p>
                  {schoolSummary &&
                    Object.entries(schoolSummary.byState).map(([state, count]) => (
                      <p key={state} className="text-xs">
                        {state}: {count}
                      </p>
                    ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Export contains institutional identifiers only (e.g., school name/ID) and state. No student/teacher data.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!schoolSummary}
                  onClick={async () => {
                    if (!schoolSummary) return;
                    const rows = Object.entries(schoolSummary.byState).map(([state, count]) => ({
                      lifecycle_state: state,
                      schools: count,
                    }));
                    triggerDownload('school_registry_summary.csv', rows);
                    await logExport('school_registry_summary', 'csv');
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
                <Badge variant="outline" className="text-[11px]">
                  Aggregated • No PII
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminExport;


