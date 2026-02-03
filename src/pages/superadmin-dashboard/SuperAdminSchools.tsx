import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingState } from '@/components/shared/LoadingState';
import { superAdminApi, School, SchoolSubscription } from '@/services/superAdminApi';
import { Search, CreditCard, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SuperAdminSchools = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["superadmin", "schools", page, search],
    queryFn: () => superAdminApi.getSchools(page, 50, search),
  });

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

  const handleViewSchool = (school: School) => {
    setSelectedSchool(school);
    setDialogOpen(true);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">School Registry</h1>
          <p className="text-muted-foreground">Manage all schools on the platform</p>
        </div>

        {/* Schools Table Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Schools</CardTitle>
                <CardDescription>View and manage school accounts</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schools..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading schools..." />
            ) : data?.schools.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {search ? "No schools found matching your search" : "No schools found"}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.schools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.email || "N/A"}</TableCell>
                        <TableCell>{school.phone || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={school.is_active ? "default" : "secondary"}>
                            {school.is_active ? "Active" : "Suspended"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{school.subscription_status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(school.created_at)}</TableCell>
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
                {data && data.total > 50 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(page - 1) * 50 + 1} to {Math.min(page * 50, data.total)} of {data.total} schools
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
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminSchools;

