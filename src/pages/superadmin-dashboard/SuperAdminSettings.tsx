import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminSettingsApi, superAdminAuditApi, type PlatformSettings } from '@/services/superAdminApi';
import { Wrench, RefreshCw } from 'lucide-react';
import { LoadingState } from '@/components/shared/LoadingState';
import { useAuth } from '@/contexts/AuthContext';

const SuperAdminSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, refetch } = useQuery<PlatformSettings>({
    queryKey: ['superadmin', 'platform-settings'],
    queryFn: () => superAdminSettingsApi.getSettings(),
  });

  const mutation = useMutation({
    mutationFn: async (partial: Partial<PlatformSettings>) => {
      const actor = user?.email || 'superadmin@eddge.com';
      const updated = await superAdminSettingsApi.updateSettings(partial, actor);
      await superAdminAuditApi.logAdminAction({
        actor,
        action: 'PLATFORM_SETTINGS_UPDATE',
        target: 'platform_settings',
        metadata: JSON.stringify(partial),
      });
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'platform-settings'] });
    },
  });

  if (isLoading || !data) {
    return (
      <SuperAdminDashboardLayout>
        <LoadingState message="Loading platform settings..." />
      </SuperAdminDashboardLayout>
    );
  }

  const lastUpdated = new Date(data.updatedAt).toLocaleString();

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Settings</h1>
            <p className="text-muted-foreground">
              Configuration-only settings for the EDDGE platform. Changes here do not cause immediate runtime impact in this phase.
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
            <Wrench className="h-5 w-5 text-slate-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">
                Settings are configuration-only.
              </p>
              <p className="text-xs text-slate-800">
                In this phase, toggles and limits here are informational and do not directly change runtime behaviour. All updates are audited.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Maintenance Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Global toggle to indicate platform maintenance windows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Maintenance banner</p>
                  <p className="text-xs text-muted-foreground">
                    When enabled, UIs can show read-only maintenance banners (no hard blocks in this phase).
                  </p>
                </div>
                <Switch
                  checked={data.maintenanceMode}
                  onCheckedChange={(checked) =>
                    mutation.mutate({ maintenanceMode: checked })
                  }
                  disabled={mutation.isPending}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated by <span className="font-semibold">{data.updatedBy}</span> at {lastUpdated}.
              </p>
            </CardContent>
          </Card>

          {/* Default Language */}
          <Card>
            <CardHeader>
              <CardTitle>Default Language</CardTitle>
              <CardDescription>Preferred language for platform copy and messaging.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="default-language">Language code (e.g., en, hi)</Label>
                <Input
                  id="default-language"
                  defaultValue={data.defaultLanguage}
                  onBlur={(e) => {
                    const value = e.target.value || 'en';
                    if (value !== data.defaultLanguage) {
                      mutation.mutate({ defaultLanguage: value });
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This value is a hint for UIs and services, not a hard switch in this phase.
              </p>
            </CardContent>
          </Card>

          {/* Global Feature Defaults */}
          <Card>
            <CardHeader>
              <CardTitle>Global Feature Defaults</CardTitle>
              <CardDescription>Default enablement for major platform features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Doubt Solver</p>
                  <p className="text-xs text-muted-foreground">Default state for Doubt Solver across schools.</p>
                </div>
                <Switch
                  checked={data.globalFeatureDefaults.doubtSolverEnabled}
                  onCheckedChange={(checked) =>
                    mutation.mutate({
                      globalFeatureDefaults: {
                        ...data.globalFeatureDefaults,
                        doubtSolverEnabled: checked,
                      },
                    })
                  }
                  disabled={mutation.isPending}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Foundation Engine</p>
                  <p className="text-xs text-muted-foreground">Default state for concept learning features.</p>
                </div>
                <Switch
                  checked={data.globalFeatureDefaults.foundationEngineEnabled}
                  onCheckedChange={(checked) =>
                    mutation.mutate({
                      globalFeatureDefaults: {
                        ...data.globalFeatureDefaults,
                        foundationEngineEnabled: checked,
                      },
                    })
                  }
                  disabled={mutation.isPending}
                />
              </div>
              <Badge variant="outline" className="text-[11px]">
                Config only • no runtime coupling in Phase 2
              </Badge>
            </CardContent>
          </Card>

          {/* Platform Usage Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Usage Limits</CardTitle>
              <CardDescription>Soft global usage ceilings for planning and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="usage-limit">Monthly request ceiling</Label>
                <Input
                  id="usage-limit"
                  type="number"
                  min={0}
                  defaultValue={data.platformUsageLimitMonthlyRequests}
                  onBlur={(e) => {
                    const value = Number(e.target.value || 0);
                    if (value !== data.platformUsageLimitMonthlyRequests) {
                      mutation.mutate({ platformUsageLimitMonthlyRequests: value });
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Used for planning and alert thresholds only; not enforced as a hard cap.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminSettings;


