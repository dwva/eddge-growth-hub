import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { superAdminFeatureApi, superAdminAuditApi, type FeatureFlag } from '@/services/superAdminApi';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SuperAdminFeatures = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, isError } = useQuery<FeatureFlag[]>({
    queryKey: ['superadmin', 'features'],
    queryFn: () => superAdminFeatureApi.getFeatureFlags(),
  });

  const refetchFlags = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['superadmin', 'features'] });
    setIsRefreshing(false);
  };

  const logAction = async (action: string, target: string, metadata?: string) => {
    try {
      await superAdminAuditApi.logAdminAction({
        actor: user?.email || 'superadmin@eddge.com',
        action,
        target,
        metadata,
      });
    } catch {
      // ignore log failures in UI
    }
  };

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      await superAdminFeatureApi.updateFeatureFlagStatus(id, enabled);
      await logAction('FEATURE_TOGGLE', id, `enabled=${enabled}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'features'] });
    },
  });

  const rolloutMutation = useMutation({
    mutationFn: async ({ id, percentage }: { id: string; percentage: number }) => {
      await superAdminFeatureApi.updateFeatureRollout(id, percentage);
      await logAction('FEATURE_ROLLOUT_UPDATE', id, `rollout=${percentage}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'features'] });
    },
  });

  const betaMutation = useMutation({
    mutationFn: async ({ id, isBeta }: { id: string; isBeta: boolean }) => {
      await superAdminFeatureApi.setFeatureBeta(id, isBeta);
      await logAction('FEATURE_BETA_UPDATE', id, `beta=${isBeta}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'features'] });
    },
  });

  const handleToggle = (flag: FeatureFlag, enabled: boolean) => {
    toggleMutation.mutate({ id: flag.id, enabled });
  };

  const handleRolloutChange = (flag: FeatureFlag, values: number[]) => {
    const value = values[0];
    rolloutMutation.mutate({ id: flag.id, percentage: value });
  };

  const handleBetaToggle = (flag: FeatureFlag, isBeta: boolean) => {
    betaMutation.mutate({ id: flag.id, isBeta });
  };

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-3 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">Feature Flags & Rollouts</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Safely control platform features, beta programs, and gradual rollouts. Changes do not affect school
              dashboards in this phase.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetchFlags}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Feature Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading feature flags..." />
            ) : isError || !data || data.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No feature flags configured"
                description="Feature flags configured for the platform will appear here."
              />
            ) : (
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[110px]">Global Status</TableHead>
                    <TableHead className="w-[220px]">Rollout %</TableHead>
                    <TableHead className="w-[110px]">Beta</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((flag) => (
                    <TableRow key={flag.id}>
                      <TableCell className="font-medium">{flag.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {flag.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={flag.enabled}
                            onCheckedChange={(checked) => handleToggle(flag, checked)}
                            disabled={toggleMutation.isPending}
                          />
                          <span className="text-xs text-muted-foreground">
                            {flag.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Slider
                            value={[flag.rolloutPercentage]}
                            min={0}
                            max={100}
                            step={5}
                            onValueChange={(values) => handleRolloutChange(flag, values)}
                            disabled={rolloutMutation.isPending}
                          />
                          <span className="text-xs text-muted-foreground">
                            {flag.rolloutPercentage}% of eligible users
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={flag.isBeta}
                            onCheckedChange={(checked) => handleBetaToggle(flag, checked)}
                            disabled={betaMutation.isPending}
                          />
                          {flag.isBeta && (
                            <Badge variant="outline" className="text-xs">
                              Beta
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(flag.updatedAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminFeatures;


