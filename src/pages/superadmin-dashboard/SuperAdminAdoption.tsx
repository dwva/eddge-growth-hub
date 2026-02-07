import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { superAdminAdoptionApi, type AdoptionSummary } from '@/services/superAdminApi';
import { LoadingState } from '@/components/shared/LoadingState';
import { BarChart2, Users, Activity } from 'lucide-react';

const SuperAdminAdoption = () => {
  const { data, isLoading } = useQuery<AdoptionSummary>({
    queryKey: ['superadmin', 'adoption'],
    queryFn: () => superAdminAdoptionApi.getAdoptionSummary(),
  });

  if (isLoading || !data) {
    return (
      <SuperAdminDashboardLayout>
        <LoadingState message="Loading adoption & onboarding insights..." />
      </SuperAdminDashboardLayout>
    );
  }

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-3 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">Adoption &amp; Onboarding</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Read-only, aggregated signals about onboarding completion and feature adoption across schools.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid gap-2 md:gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Onboarding Status</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.onboardingComplete}</div>
              <p className="text-xs text-muted-foreground">
                of {data.totalSchools} schools have completed onboarding
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {data.onboardingInProgress} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Usage Schools</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.lowUsageSchools}</div>
              <p className="text-xs text-muted-foreground">
                schools flagged as low adoption candidates for success outreach
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feature Adoption</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              <p>
                Doubt Solver:{' '}
                <span className="font-semibold text-foreground">{data.featureAdoption.doubtSolver}%</span> of schools active
              </p>
              <p>
                Foundation Engine:{' '}
                <span className="font-semibold text-foreground">{data.featureAdoption.foundationEngine}%</span> of schools active
              </p>
              <p>
                Assessments:{' '}
                <span className="font-semibold text-foreground">{data.featureAdoption.assessments}%</span> of schools active
              </p>
              <Badge variant="outline" className="mt-1 text-[11px]">
                Aggregated only • no school detail views
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminAdoption;


