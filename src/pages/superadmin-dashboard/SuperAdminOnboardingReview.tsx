import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { superAdminOnboardingApi, type SchoolOnboardingInvite, type OnboardingStepData } from '@/services/superAdminApi';
import { School, CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';

const SuperAdminOnboardingReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedInvite, setSelectedInvite] = useState<SchoolOnboardingInvite | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [correctionDialogOpen, setCorrectionDialogOpen] = useState(false);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [emailPreviewDialogOpen, setEmailPreviewDialogOpen] = useState(false);
  const [emailPreview, setEmailPreview] = useState<string>('');

  const { data: queue, isLoading, isError, refetch } = useQuery<SchoolOnboardingInvite[]>({
    queryKey: ['superadmin', 'onboarding-queue'],
    queryFn: () => superAdminOnboardingApi.getOnboardingQueue(),
  });

  const { data: inviteDetails } = useQuery<SchoolOnboardingInvite & { stepData?: OnboardingStepData }>({
    queryKey: ['superadmin', 'onboarding-status', selectedInvite?.id],
    queryFn: () => selectedInvite ? superAdminOnboardingApi.getSchoolOnboardingStatus(selectedInvite.id) : null,
    enabled: !!selectedInvite && reviewDialogOpen,
  });

  const submittedSchools = queue?.filter(s => s.onboardingStatus === 'SUBMITTED') || [];

  const approveMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      return await superAdminOnboardingApi.approveSchool(inviteId, user?.email || 'superadmin@eddge.com');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'onboarding-queue'] });
      setReviewDialogOpen(false);
      setSelectedInvite(null);
      toast({
        title: 'School Approved',
        description: 'School has been activated and school admin access enabled.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve school',
        variant: 'destructive',
      });
    },
  });

  const requestCorrectionMutation = useMutation({
    mutationFn: async ({ inviteId, notes }: { inviteId: string; notes: string }) => {
      return await superAdminOnboardingApi.requestCorrection(inviteId, notes, user?.email || 'superadmin@eddge.com');
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'onboarding-queue'] });
      setCorrectionDialogOpen(false);
      if (result.emailPreview) {
        setEmailPreview(result.emailPreview);
        setEmailPreviewDialogOpen(true);
      }
      setCorrectionNotes('');
      toast({
        title: 'Correction Requested',
        description: 'School admin has been notified to make corrections (mock).',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to request correction',
        variant: 'destructive',
      });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      return await superAdminOnboardingApi.suspendOnboarding(inviteId, user?.email || 'superadmin@eddge.com');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'onboarding-queue'] });
      toast({
        title: 'Onboarding Suspended',
        description: 'School onboarding has been suspended.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to suspend onboarding',
        variant: 'destructive',
      });
    },
  });

  const handleReview = (invite: SchoolOnboardingInvite) => {
    setSelectedInvite(invite);
    setReviewDialogOpen(true);
  };

  const handleApprove = () => {
    if (selectedInvite) {
      approveMutation.mutate(selectedInvite.id);
    }
  };

  const handleRequestCorrection = () => {
    if (selectedInvite && correctionNotes.trim()) {
      requestCorrectionMutation.mutate({ inviteId: selectedInvite.id, notes: correctionNotes });
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Onboarding Review</h1>
            <p className="text-muted-foreground">
              Review and approve submitted school onboarding applications. Only SuperAdmin can approve schools.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Submitted Schools */}
        <Card>
          <CardHeader>
            <CardTitle>Submitted Schools</CardTitle>
            <CardDescription>Review schools that have completed onboarding and are awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading submitted schools..." />
            ) : isError || submittedSchools.length === 0 ? (
              <EmptyState
                icon={School}
                title="No submitted schools"
                description="Schools that complete onboarding will appear here for review."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedSchools.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">{invite.schoolName}</TableCell>
                      <TableCell>{invite.contactEmail}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{invite.initialPlan}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={invite.onboardingProgress} className="w-20" />
                          <span className="text-xs text-muted-foreground">{invite.onboardingProgress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(invite.submittedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReview(invite)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => suspendMutation.mutate(invite.id)}
                            disabled={suspendMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Onboarding: {selectedInvite?.schoolName}</DialogTitle>
              <DialogDescription>
                Review the school's onboarding details before approval
              </DialogDescription>
            </DialogHeader>

            {inviteDetails && (
              <div className="space-y-4">
                {/* School Profile */}
                {inviteDetails.stepData?.schoolProfile && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">School Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">School Name: </span>
                        <span className="text-sm">{inviteDetails.stepData.schoolProfile.schoolName}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Academic Year: </span>
                        <span className="text-sm">{inviteDetails.stepData.schoolProfile.academicYear}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Academic Setup */}
                {inviteDetails.stepData?.academicSetup && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Academic Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Classes: </span>
                        <span className="text-sm">{inviteDetails.stepData.academicSetup.classes.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Sections: </span>
                        <div className="text-sm space-y-1 mt-1">
                          {Object.entries(inviteDetails.stepData.academicSetup.sections).map(([cls, sections]) => (
                            <div key={cls} className="ml-4">
                              {cls}: {sections.join(', ')}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Teacher Setup */}
                {inviteDetails.stepData?.teacherSetup && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Teacher Setup</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        {inviteDetails.stepData.teacherSetup.teachers.map((teacher, idx) => (
                          <div key={idx} className="text-sm">
                            {teacher.name} ({teacher.email}) - {teacher.subject || 'N/A'}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Platform Preferences */}
                {inviteDetails.stepData?.platformPreferences && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Platform Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Language: </span>
                        <span className="text-sm">{inviteDetails.stepData.platformPreferences.languagePreference}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setReviewDialogOpen(false);
                  setCorrectionDialogOpen(true);
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Request Correction
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedInvite) {
                    suspendMutation.mutate(selectedInvite.id);
                    setReviewDialogOpen(false);
                  }
                }}
                disabled={suspendMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Suspend
              </Button>
              <Button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {approveMutation.isPending ? 'Approving...' : 'Approve School'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Correction Request Dialog */}
        <Dialog open={correctionDialogOpen} onOpenChange={setCorrectionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Correction</DialogTitle>
              <DialogDescription>
                Provide notes about what needs to be corrected in the onboarding application.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="correctionNotes">Correction Notes *</Label>
                <Textarea
                  id="correctionNotes"
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder="Please specify what needs to be corrected..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCorrectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRequestCorrection}
                disabled={!correctionNotes.trim() || requestCorrectionMutation.isPending}
              >
                {requestCorrectionMutation.isPending ? 'Sending...' : 'Send Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Email Preview Dialog */}
        <Dialog open={emailPreviewDialogOpen} onOpenChange={setEmailPreviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Correction Request Email Preview</DialogTitle>
              <DialogDescription>
                This is a preview of the email that would be sent to the school admin (mock delivery only).
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={emailPreview}
                readOnly
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEmailPreviewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminOnboardingReview;

