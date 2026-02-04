import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingState } from '@/components/shared/LoadingState';
import { superAdminApi, School, SchoolSubscription } from '@/services/superAdminApi';
import { Search, CreditCard, Eye, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SuperAdminSchools = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lifecycleDialogOpen, setLifecycleDialogOpen] = useState(false);
  const [lifecycleTarget, setLifecycleTarget] = useState<School | null>(null);
  const [lifecycleValue, setLifecycleValue] = useState<string>('ACTIVE');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["superadmin", "schools", page, search],
    queryFn: () => superAdminApi.getSchools(page, 50, search),
  });

  // Filter schools client-side by status and plan
  const filteredSchools = useMemo(() => {
    if (!data?.schools) return [];
    return data.schools.filter(school => {
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && school.is_active) ||
        (statusFilter === 'suspended' && !school.is_active) ||
        (statusFilter === 'trial' && school.subscription_status === 'Trial');
      const matchesPlan = planFilter === 'all' || school.subscription_status === planFilter;
      return matchesStatus && matchesPlan;
    });
  }, [data?.schools, statusFilter, planFilter]);

  const { data: subscriptionData } = useQuery({
    queryKey: ["superadmin", "school-subscription", selectedSchool?.id],
    queryFn: () => selectedSchool ? superAdminApi.getSchoolSubscription(selectedSchool.id) : null,
    enabled: !!selectedSchool,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ schoolId, isActive }: { schoolId: string; isActive: boolean }) =>
      superAdminApi.toggleSchoolStatus(schoolId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin", "schools"] });
      toast({
        title: "Success",
        description: "School status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update school status",
        variant: "destructive",
      });
    },
  });

  const lifecycleMutation = useMutation({
    mutationFn: ({ schoolId, lifecycle }: { schoolId: string; lifecycle: string }) =>
      superAdminApi.updateSchoolLifecycle(
        schoolId,
        lifecycle as 'TRIAL' | 'PILOT' | 'ACTIVE' | 'SUSPENDED' | 'CHURNED'
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin", "schools"] });
      setLifecycleDialogOpen(false);
      toast({
        title: "Lifecycle updated",
        description: "School lifecycle state updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update lifecycle state",
        variant: "destructive",
      });
    },
  });

  const handleViewSchool = (school: School) => {
    setSelectedSchool(school);
    setDialogOpen(true);
  };

  const openLifecycleDialog = (school: School) => {
    setLifecycleTarget(school);
    setLifecycleValue((school as any).lifecycle_state || 'ACTIVE');
    setLifecycleDialogOpen(true);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">School Registry</h1>
            <p className="text-muted-foreground">Manage all schools on the platform</p>
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

        {/* Lifecycle summary chips */}
        {data?.schools && data.schools.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {['TRIAL', 'PILOT', 'ACTIVE', 'SUSPENDED', 'CHURNED'].map((state) => {
              const count = data.schools.filter((s: any) => s.lifecycle_state === state).length;
              if (count === 0) return null;
              const variant =
                state === 'ACTIVE'
                  ? 'default'
                  : state === 'TRIAL' || state === 'PILOT'
                  ? 'outline'
                  : 'secondary';
              return (
                <Badge key={state} variant={variant as any} className="text-xs px-3 py-1">
                  {state} • {count}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Schools Table Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Schools</CardTitle>
                <CardDescription>View and manage school accounts</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={(value) => { setPlanFilter(value); setPage(1); }}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading schools..." />
            ) : filteredSchools.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {search || statusFilter !== 'all' || planFilter !== 'all' 
                  ? "No schools found matching your filters" 
                  : "No schools found"}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Contact Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Subscription Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Lifecycle</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.email || "N/A"}</TableCell>
                        <TableCell>{school.phone || "N/A"}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{school.address || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{school.subscription_status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={school.is_active ? "default" : "secondary"}>
                            {school.is_active ? "Active" : "Suspended"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewSchool(school)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openLifecycleDialog(school)}
                            >
                              Lifecycle
                            </Button>
                            <Button
                              variant={school.is_active ? "destructive" : "default"}
                              size="sm"
                              onClick={() => toggleMutation.mutate({
                                schoolId: school.id,
                                isActive: !school.is_active,
                              })}
                              disabled={toggleMutation.isPending}
                            >
                              {school.is_active ? "Suspend" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {filteredSchools.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredSchools.length} of {data?.total || 0} schools
                      {(statusFilter !== 'all' || planFilter !== 'all') && ' (filtered)'}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page * 50 >= data.total}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* View School Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedSchool?.name}</DialogTitle>
              <DialogDescription>School details and subscription information</DialogDescription>
            </DialogHeader>
            
            {selectedSchool && (
              <>
                {/* School Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{selectedSchool.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-sm">{selectedSchool.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-sm">{selectedSchool.address || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={selectedSchool.is_active ? "default" : "secondary"}>
                      {selectedSchool.is_active ? "Active" : "Suspended"}
                    </Badge>
                  </div>
                </div>

                {/* Subscription Details Section */}
                {subscriptionData && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4" />
                      <p className="text-sm font-medium">Subscription Details</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Plan</p>
                        <p className="text-sm">{subscriptionData.plan_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge variant="outline">{subscriptionData.subscription_status}</Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                        <p className="text-sm">{formatDate(subscriptionData.start_date)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Renewal Date</p>
                        <p className="text-sm">{formatDate(subscriptionData.renewal_date)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Lifecycle Dialog */}
        <Dialog open={lifecycleDialogOpen} onOpenChange={setLifecycleDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Change Lifecycle State</DialogTitle>
              <DialogDescription>
                Update the lifecycle state for <span className="font-semibold">{lifecycleTarget?.name}</span>.
                This does not affect billing or historical metrics.
              </DialogDescription>
            </DialogHeader>
            {lifecycleTarget && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label>Lifecycle state</Label>
                  <Select value={lifecycleValue} onValueChange={setLifecycleValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lifecycle state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRIAL">TRIAL</SelectItem>
                      <SelectItem value="PILOT">PILOT</SelectItem>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                      <SelectItem value="CHURNED">CHURNED</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Lifecycle is orthogonal to subscription plan and used for internal success/expansion tracking.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLifecycleDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      lifecycleTarget &&
                      lifecycleMutation.mutate({
                        schoolId: lifecycleTarget.id,
                        lifecycle: lifecycleValue,
                      })
                    }
                    disabled={lifecycleMutation.isPending}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminSchools;

