import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminAICostsApi, superAdminAuditApi, type AICostGuardrails } from '@/services/superAdminApi';
import { Brain, AlertTriangle, RefreshCw } from 'lucide-react';
import { LoadingState } from '@/components/shared/LoadingState';
import { useAuth } from '@/contexts/AuthContext';

const SuperAdminAICosts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, refetch } = useQuery<AICostGuardrails>({
    queryKey: ['superadmin', 'ai-cost-guardrails'],
    queryFn: () => superAdminAICostsApi.getAICostGuardrails(),
  });

  const logUpdate = async (metadata: string) => {
    try {
      await superAdminAuditApi.logAdminAction({
        actor: user?.email || 'superadmin@eddge.com',
        action: 'AI_COST_GUARDRAILS_UPDATE',
        target: 'ai_cost_guardrails',
        metadata,
      });
    } catch {
      // ignore
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (partial: Partial<AICostGuardrails>) => {
      const updated = await superAdminAICostsApi.updateAICostGuardrails(partial);
      await logUpdate(JSON.stringify(partial));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'ai-cost-guardrails'] });
    },
  });

  if (isLoading || !data) {
    return (
      <SuperAdminDashboardLayout>
        <LoadingState message="Loading AI cost guardrails..." />
      </SuperAdminDashboardLayout>
    );
  }

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-3 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">AI Cost Guardrails</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Configure soft limits and warning thresholds for AI usage. No hard blocking is enforced in Phase 2.
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
            <AlertTriangle className="h-5 w-5 text-amber-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Warnings only – no blocking.
              </p>
              <p className="text-xs text-amber-800">
                Guardrails configured here surface warnings and alerts, but do not stop requests or affect school dashboards in this phase.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-2 md:gap-4 lg:grid-cols-3">
          {/* Per-School AI Caps */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Per-School AI Caps
              </CardTitle>
              <CardDescription>
                Configure soft monthly caps and warning thresholds per school (USD). Values are mock and non-binding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground">
                <span>School</span>
                <span>Monthly Cap (USD)</span>
                <span>Warning Threshold (USD)</span>
              </div>
              {data.perSchoolCaps.map((row) => (
                <div key={row.schoolId} className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-sm text-foreground">{row.schoolName}</span>
                  <Input
                    type="number"
                    defaultValue={row.monthlyCapUsd}
                    min={0}
                    className="h-8"
                    onBlur={(e) => {
                      const value = Number(e.target.value || 0);
                      if (value !== row.monthlyCapUsd) {
                        const updated = data.perSchoolCaps.map((cap) =>
                          cap.schoolId === row.schoolId ? { ...cap, monthlyCapUsd: value } : cap
                        );
                        updateMutation.mutate({ perSchoolCaps: updated });
                      }
                    }}
                  />
                  <Input
                    type="number"
                    defaultValue={row.warningThresholdUsd}
                    min={0}
                    className="h-8"
                    onBlur={(e) => {
                      const value = Number(e.target.value || 0);
                      if (value !== row.warningThresholdUsd) {
                        const updated = data.perSchoolCaps.map((cap) =>
                          cap.schoolId === row.schoolId ? { ...cap, warningThresholdUsd: value } : cap
                        );
                        updateMutation.mutate({ perSchoolCaps: updated });
                      }
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Global thresholds + per-feature caps */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Global Cost Warning Thresholds</CardTitle>
                <CardDescription>Soft global thresholds for monthly AI spend.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="global-low">Warning (Low)</Label>
                  <Input
                    id="global-low"
                    type="number"
                    defaultValue={data.globalWarningLow}
                    min={0}
                    className="h-8"
                    onBlur={(e) => {
                      const value = Number(e.target.value || 0);
                      if (value !== data.globalWarningLow) {
                        updateMutation.mutate({ globalWarningLow: value });
                      }
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="global-high">Warning (High)</Label>
                  <Input
                    id="global-high"
                    type="number"
                    defaultValue={data.globalWarningHigh}
                    min={0}
                    className="h-8"
                    onBlur={(e) => {
                      const value = Number(e.target.value || 0);
                      if (value !== data.globalWarningHigh) {
                        updateMutation.mutate({ globalWarningHigh: value });
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Per-Feature AI Caps</CardTitle>
                <CardDescription>Soft monthly caps per AI feature.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.perFeatureCaps.map((row) => (
                  <div key={row.featureId} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{row.featureName}</span>
                      <Badge variant="outline" className="text-[11px]">
                        {row.featureId}
                      </Badge>
                    </div>
                    <Input
                      type="number"
                      defaultValue={row.monthlyCapUsd}
                      min={0}
                      className="h-8"
                      onBlur={(e) => {
                        const value = Number(e.target.value || 0);
                        if (value !== row.monthlyCapUsd) {
                          const updated = data.perFeatureCaps.map((cap) =>
                            cap.featureId === row.featureId ? { ...cap, monthlyCapUsd: value } : cap
                          );
                          updateMutation.mutate({ perFeatureCaps: updated });
                        }
                      }}
                    />
                  </div>
                ))}
                <p className="text-[11px] text-muted-foreground">
                  These caps inform alerting and reporting only; they do not throttle usage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminAICosts;


