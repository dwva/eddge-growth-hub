import { useQuery } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { superAdminApi, PlatformOverview } from '@/services/superAdminApi';
import { Building2, Users, Activity, Server, AlertCircle, CheckCircle2, AlertTriangle, XCircle, TrendingUp, AlertCircle as ErrorIcon } from 'lucide-react';

const SuperAdminOverview = () => {
  const { data, isLoading, error, refetch } = useQuery<PlatformOverview>({
    queryKey: ["superadmin", "overview"],
    queryFn: () => superAdminApi.getPlatformOverview(),
    refetchInterval: 30000, // Auto-refresh every 30 seconds for near real-time updates
    retry: 2,
  });

  const getSystemStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Operational
          </Badge>
        );
      case 'degraded':
        return (
          <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Degraded
          </Badge>
        );
      case 'down':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Down
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <SuperAdminDashboardLayout>
        <LoadingState message="Loading platform overview..." />
      </SuperAdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminDashboardLayout>
        <EmptyState
          icon={AlertCircle}
          title="Failed to load platform overview"
          description="Please try refreshing the page"
        />
      </SuperAdminDashboardLayout>
    );
  }

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">High-level snapshot of platform growth, usage, and health</p>
        </div>

        {/* Primary Metrics - 4 Main Widgets */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Schools Widget */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Schools</CardTitle>
              <Building2 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data?.total_schools?.toLocaleString() || "0"}</div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Active</span>
                  <span className="font-medium text-gray-900">{data?.schools_breakdown?.active || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Trial</span>
                  <span className="font-medium text-gray-900">{data?.schools_breakdown?.trial || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Suspended</span>
                  <span className="font-medium text-gray-900">{data?.schools_breakdown?.suspended || 0}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">All schools onboarded</p>
            </CardContent>
          </Card>

          {/* Total Users Widget */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data?.total_users?.toLocaleString() || "0"}</div>
              <p className="text-xs text-muted-foreground mt-2">Aggregated across all roles and schools</p>
            </CardContent>
          </Card>

          {/* Daily Active Users Widget */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Daily Active Users</CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data?.daily_active_users?.toLocaleString() || "0"}</div>
              <p className="text-xs text-muted-foreground mt-2">Unique users active today</p>
            </CardContent>
          </Card>

          {/* System Uptime Widget */}
          <Card className={`border-l-4 ${
            data?.system_status === 'operational' ? 'border-l-green-500' :
            data?.system_status === 'degraded' ? 'border-l-yellow-500' :
            'border-l-red-500'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">System Uptime</CardTitle>
              <Server className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data?.system_uptime_percentage?.toFixed(1) || "0.0"}%</div>
              <div className="mt-2">
                {data?.system_status && getSystemStatusBadge(data.system_status)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Current system status</p>
            </CardContent>
          </Card>
        </div>

        {/* Optional Read-Only Signals */}
        {(data?.new_schools_today !== undefined || data?.new_users_today !== undefined || data?.total_errors_24h !== undefined) && (
          <div className="grid gap-4 md:grid-cols-3">
            {/* New Schools Today */}
            {data?.new_schools_today !== undefined && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">New Schools Today</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{data.new_schools_today}</div>
                  <p className="text-xs text-muted-foreground mt-1">Onboarded today</p>
                </CardContent>
              </Card>
            )}

            {/* New Users Today */}
            {data?.new_users_today !== undefined && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">New Users Today</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{data.new_users_today.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Added today</p>
                </CardContent>
              </Card>
            )}

            {/* Total Errors 24h */}
            {data?.total_errors_24h !== undefined && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Errors (24h)</CardTitle>
                  <ErrorIcon className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{data.total_errors_24h}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total errors in last 24 hours</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminOverview;
