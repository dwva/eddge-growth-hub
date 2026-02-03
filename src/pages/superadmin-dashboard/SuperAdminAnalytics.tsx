import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { superAdminApi, UsageAnalytics } from '@/services/superAdminApi';
import { TrendingUp, Zap, Brain, RefreshCw, AlertCircle } from 'lucide-react';
import { format, subDays } from 'date-fns';

const SuperAdminAnalytics = () => {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data, isLoading, error, refetch, isRefetching } = useQuery<UsageAnalytics>({
    queryKey: ["superadmin", "analytics", startDate, endDate],
    queryFn: () => superAdminApi.getUsageAnalytics(startDate, endDate),
  });

  const handleRefresh = () => {
    refetch();
  };

  const totalUsers = data?.user_growth?.reduce((sum, day) => sum + day.count, 0) || 0;

  if (isLoading) {
    return (
      <SuperAdminDashboardLayout>
        <LoadingState message="Loading analytics..." />
      </SuperAdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminDashboardLayout>
        <EmptyState
          icon={AlertCircle}
          title="Failed to load analytics"
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

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Usage Analytics</h1>
            <p className="text-muted-foreground">Platform usage trends and metrics</p>
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

        {/* Date Range Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
            <CardDescription>Select the period for analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* User Growth */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Growth Trends</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {data?.user_growth?.length || 0} days tracked
              </p>
              {data?.user_growth && data.user_growth.length > 0 && (
                <div className="mt-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Recent growth:</p>
                  {data.user_growth.slice(-5).map((day, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>{new Date(day.date).toLocaleDateString()}</span>
                      <span className="font-medium text-green-600">+{day.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feature Usage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feature Usage</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Doubt Solver</p>
                    <p className="text-xs text-muted-foreground">AI-powered question answering</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{data?.feature_usage?.doubt_solver?.toLocaleString() || 0}</p>
                    <p className="text-xs text-muted-foreground">uses</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Foundation Engine</p>
                    <p className="text-xs text-muted-foreground">Concept learning system</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{data?.feature_usage?.foundation_engine?.toLocaleString() || 0}</p>
                    <p className="text-xs text-muted-foreground">uses</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Assessments</p>
                    <p className="text-xs text-muted-foreground">Tests and quizzes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{data?.feature_usage?.assessments?.toLocaleString() || 0}</p>
                    <p className="text-xs text-muted-foreground">uses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Consumption */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Consumption</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Requests</p>
                  <p className="text-2xl font-bold">{data?.ai_consumption?.total_requests?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Tokens</p>
                  <p className="text-2xl font-bold">{data?.ai_consumption?.total_tokens?.toLocaleString() || 0}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Cost (USD)</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${data?.ai_consumption?.cost_usd?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminAnalytics;

