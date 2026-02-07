import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { superAdminAlertsApi, superAdminAuditApi, type AlertConfig } from '@/services/superAdminApi';
import { Bell, Activity, Cpu, CloudOff, RefreshCw, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SuperAdminAlerts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, isError } = useQuery<AlertConfig>({
    queryKey: ['superadmin', 'alerts-config'],
    queryFn: () => superAdminAlertsApi.getAlertConfig(),
  });

  const refetchConfig = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['superadmin', 'alerts-config'] });
    setIsRefreshing(false);
  };

  const logAction = async (target: string, metadata: string) => {
    try {
      await superAdminAuditApi.logAdminAction({
        actor: user?.email || 'superadmin@eddge.com',
        action: 'ALERT_UPDATE',
        target,
        metadata,
      });
    } catch {
      // ignore logging failures on UI
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (partial: Partial<AlertConfig>) => {
      const actor = user?.email || 'superadmin@eddge.com';
      const updated = await superAdminAlertsApi.updateAlertConfig(partial, actor);
      await logAction('alerts_config', JSON.stringify(partial));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'alerts-config'] });
    },
  });

  if (isLoading) {
    return (
      <SuperAdminDashboardLayout>
        <LoadingState message="Loading alert thresholds..." />
      </SuperAdminDashboardLayout>
    );
  }

  if (isError || !data) {
    return (
      <SuperAdminDashboardLayout>
        <EmptyState
          icon={Bell}
          title="Unable to load alert configuration"
          description="Please try refreshing the page."
          action={
            <Button onClick={refetchConfig} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          }
        />
      </SuperAdminDashboardLayout>
    );
  }

  const lastUpdatedAt = new Date(data.updatedAt).toLocaleString();

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-3 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">Alerts & Thresholds</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Configure platform-level alert thresholds. This is configuration-only in Phase 2; no real notifications are sent.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetchConfig}
            disabled={isRefreshing || updateMutation.isPending}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-2 md:gap-4 md:grid-cols-2">
          {/* DAU Threshold */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Daily Active Users Threshold
              </CardTitle>
              <CardDescription>
                Alert when DAU drops below the configured threshold.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dau-threshold">DAU Threshold</Label>
                <Input
                  id="dau-threshold"
                  type="number"
                  defaultValue={data.dauThreshold}
                  min={0}
                  onBlur={(e) => {
                    const value = Number(e.target.value || 0);
                    if (value !== data.dauThreshold) {
                      updateMutation.mutate({ dauThreshold: value });
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Example: Alert when DAU &lt; {data.dauThreshold.toLocaleString()}.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated by <span className="font-medium">{data.updatedBy}</span> at {lastUpdatedAt}.
              </p>
            </CardContent>
          </Card>

          {/* Error Spike Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-red-500" />
                Error Spike Alert
              </CardTitle>
              <CardDescription>
                Alert when errors in a 15-minute window exceed the configured threshold.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="error-spike">Error count in 15 minutes</Label>
                <Input
                  id="error-spike"
                  type="number"
                  defaultValue={data.errorSpikeThreshold}
                  min={0}
                  onBlur={(e) => {
                    const value = Number(e.target.value || 0);
                    if (value !== data.errorSpikeThreshold) {
                      updateMutation.mutate({ errorSpikeThreshold: value });
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Example: Alert when errors in 15 minutes &gt; {data.errorSpikeThreshold}.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated by <span className="font-medium">{data.updatedBy}</span> at {lastUpdatedAt}.
              </p>
            </CardContent>
          </Card>

          {/* AI Usage Limit Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-500" />
                AI Usage Limit Alert
              </CardTitle>
              <CardDescription>
                Soft limit for AI-related spend; used for warnings only in Phase 2.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-usage-limit">AI Usage Limit (USD per month)</Label>
                <Input
                  id="ai-usage-limit"
                  type="number"
                  defaultValue={data.aiUsageLimit}
                  min={0}
                  step={50}
                  onBlur={(e) => {
                    const value = Number(e.target.value || 0);
                    if (value !== data.aiUsageLimit) {
                      updateMutation.mutate({ aiUsageLimit: value });
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Example: Show warnings when projected AI cost exceeds ${data.aiUsageLimit.toLocaleString()} in a month.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated by <span className="font-medium">{data.updatedBy}</span> at {lastUpdatedAt}.
              </p>
            </CardContent>
          </Card>

          {/* System Downtime Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudOff className="h-5 w-5 text-orange-500" />
                System Downtime Alert
              </CardTitle>
              <CardDescription>
                Configure when to raise alerts if the platform is down.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Downtime Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    When disabled, downtime alerts are suppressed.
                  </p>
                </div>
                <Switch
                  checked={data.systemDowntimeEnabled}
                  onCheckedChange={(checked) =>
                    updateMutation.mutate({ systemDowntimeEnabled: checked })
                  }
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="downtime-minutes">Minimum downtime duration (minutes)</Label>
                <Input
                  id="downtime-minutes"
                  type="number"
                  defaultValue={data.systemDowntimeMinutes}
                  min={1}
                  onBlur={(e) => {
                    const value = Number(e.target.value || 1);
                    if (value !== data.systemDowntimeMinutes) {
                      updateMutation.mutate({ systemDowntimeMinutes: value });
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Example: Alert when downtime &gt;= {data.systemDowntimeMinutes} minutes.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated by <span className="font-medium">{data.updatedBy}</span> at {lastUpdatedAt}.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Preview (read-only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              Notifications Preview (Read-Only)
            </CardTitle>
            <CardDescription>
              Preview how alerts might look as banners or email notifications. This is a mock; no messages are sent in Phase 2.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2">
              <Badge variant="outline" className="mt-0.5 text-xs">
                DAU
              </Badge>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  DAU below threshold
                </p>
                <p className="text-xs text-yellow-700">
                  Daily active users have dropped below {data.dauThreshold.toLocaleString()}.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <Badge variant="outline" className="mt-0.5 text-xs">
                ERRORS
              </Badge>
              <div>
                <p className="text-sm font-medium text-red-800">
                  Error spike detected
                </p>
                <p className="text-xs text-red-700">
                  More than {data.errorSpikeThreshold} errors occurred in a 15-minute window.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2">
              <Badge variant="outline" className="mt-0.5 text-xs">
                AI COST
              </Badge>
              <div>
                <p className="text-sm font-medium text-purple-900">
                  AI usage approaching soft limit
                </p>
                <p className="text-xs text-purple-800">
                  Projected AI cost is nearing the configured limit of ${data.aiUsageLimit.toLocaleString()}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminAlerts;


