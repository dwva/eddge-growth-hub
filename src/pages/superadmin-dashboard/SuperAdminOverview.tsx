import { useQuery } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { superAdminApi, PlatformOverview } from '@/services/superAdminApi';
import { Building2, Users, Activity, Clock, RefreshCw, AlertCircle } from 'lucide-react';

const SuperAdminOverview = () => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery<PlatformOverview>({
    queryKey: ["superadmin", "overview"],
    queryFn: () => superAdminApi.getPlatformOverview(),
    refetchInterval: 60000,
    retry: 2,
  });

  const handleRefresh = () => {
    refetch();
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
          action={
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          }
        />
      </SuperAdminDashboardLayout>
    );
  }

  const stats = [
    { title: "Total Schools", value: data?.total_schools?.toLocaleString() || "0", description: "Active schools on platform", icon: Building2 },
    { title: "Total Users", value: data?.total_users?.toLocaleString() || "0", description: "All active users across schools", icon: Users },
    { title: "Daily Active Users", value: data?.daily_active_users?.toLocaleString() || "0", description: "Users active today", icon: Activity },
    { title: "System Uptime", value: `${data?.system_uptime_days || 0} days`, description: "Days since platform launch", icon: Clock },
  ];

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Overview</h1>
            <p className="text-muted-foreground">EDDGE platform-wide statistics and metrics</p>
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

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Building2 className="h-5 w-5" />
                <span>View All Schools</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Activity className="h-5 w-5" />
                <span>System Health</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="h-5 w-5" />
                <span>User Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminOverview;

