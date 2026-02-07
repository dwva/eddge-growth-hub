import { useQuery } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { superAdminApi, SystemHealth } from '@/services/superAdminApi';
import { Server, AlertTriangle, Activity, Clock, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

const SuperAdminHealth = () => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery<SystemHealth>({
    queryKey: ["superadmin", "health"],
    queryFn: () => superAdminApi.getSystemHealth(),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <SuperAdminDashboardLayout>
        <LoadingState message="Loading system health..." />
      </SuperAdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminDashboardLayout>
        <EmptyState
          icon={AlertCircle}
          title="Failed to load system health"
          description="Please try refreshing the page"
          action={
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          }
        />
      </SuperAdminDashboardLayout>
    );
  }

  const isHealthy = data?.api_status?.status === "healthy";
  const hasErrors = (data?.error_count_24h || 0) > 0;
  const hasFailedJobs = (data?.background_jobs?.failed || 0) > 0;

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-3 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">System Health</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Platform health and monitoring</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Overall Status Banner */}
        <Card className={isHealthy && !hasErrors && !hasFailedJobs ? "border-green-500" : "border-yellow-500"}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {isHealthy && !hasErrors && !hasFailedJobs ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold">All Systems Operational</p>
                    <p className="text-sm text-muted-foreground">All services are running normally</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold">System Status: Attention Required</p>
                    <p className="text-sm text-muted-foreground">
                      {hasErrors && ` ${data?.error_count_24h} errors in last 24h`}
                      {hasFailedJobs && ` ${data?.background_jobs?.failed} failed jobs`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid gap-2 md:gap-4 md:grid-cols-3">
          {/* API Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={isHealthy ? "default" : "destructive"}>
                    {data?.api_status?.status?.toUpperCase() || "UNKNOWN"}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-sm font-medium">
                      {data?.api_status?.response_time_ms || 0}ms
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (data?.api_status?.response_time_ms || 0) < 100
                          ? "bg-green-500"
                          : (data?.api_status?.response_time_ms || 0) < 500
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(((data?.api_status?.response_time_ms || 0) / 1000) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
                {data?.api_status?.last_check && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Last check: {new Date(data.api_status.last_check).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Logs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Logs</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.error_count_24h || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">Errors in last 24 hours</p>
              {hasErrors && (
                <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    ⚠️ Review error logs for details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Background Jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Background Jobs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="text-lg font-bold">{data?.background_jobs?.pending || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Running</span>
                  <span className="text-lg font-bold text-blue-600">
                    {data?.background_jobs?.running || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Failed</span>
                  <span className={`text-lg font-bold ${hasFailedJobs ? "text-destructive" : ""}`}>
                    {data?.background_jobs?.failed || 0}
                  </span>
                </div>
                {hasFailedJobs && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <p className="text-xs text-red-800 dark:text-red-200">
                      ⚠️ {data?.background_jobs?.failed} jobs require attention
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminHealth;

