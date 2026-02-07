import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { superAdminOnboardingApi, superAdminAuditApi, type SchoolOnboardingInvite, type LifecycleState } from '@/services/superAdminApi';
import { School, Mail, Phone, MapPin, RefreshCw, AlertCircle, Plus, Copy, CheckCircle, Mail as MailIcon, RefreshCw as RefreshCwIcon, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SuperAdminOnboarding = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, getAccessLevel } = useAuth();
  const accessLevel = getAccessLevel();
  const canModify = accessLevel === 'ROOT';
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedInvite, setSelectedInvite] = useState<SchoolOnboardingInvite | null>(null);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [emailPreviewDialogOpen, setEmailPreviewDialogOpen] = useState(false);
  const [emailPreview, setEmailPreview] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    schoolName: '',
    board: '',
    contactEmail: '',
    phone: '',
    location: '',
    initialPlan: 'Standard',
    lifecycleState: 'TRIAL' as LifecycleState,
  });

  const { data: queue, isLoading, isError, refetch } = useQuery<SchoolOnboardingInvite[]>({
    queryKey: ['superadmin', 'onboarding-queue'],
    queryFn: () => superAdminOnboardingApi.getOnboardingQueue(),
  });

  const { data: slaData } = useQuery({
    queryKey: ['superadmin', 'onboarding-sla'],
    queryFn: () => superAdminOnboardingApi.checkOnboardingSLA(),
    refetchInterval: 60000, // Refresh every minute
  });

  const resendInviteMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      return await superAdminOnboardingApi.resendInvite(inviteId, user?.email || 'superadmin@eddge.com');
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'onboarding-queue'] });
      setResendDialogOpen(false);
      setEmailPreview(result.preview || '');
      setEmailPreviewDialogOpen(true);
      toast({
        title: 'Invite Resent',
        description: 'Email has been sent (mock).',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend invite',
        variant: 'destructive',
      });
    },
  });

  const regenerateTokenMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      return await superAdminOnboardingApi.regenerateInviteToken(inviteId, user?.email || 'superadmin@eddge.com');
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'onboarding-queue'] });
      setRegenerateDialogOpen(false);
      toast({
        title: 'Token Regenerated',
        description: `New token: ${result.newToken.substring(0, 20)}... (expires in 24 hours)`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to regenerate token',
        variant: 'destructive',
      });
    },
  });

  const cancelOnboardingMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      return await superAdminOnboardingApi.cancelOnboarding(inviteId, user?.email || 'superadmin@eddge.com');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'onboarding-queue'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'onboarding-sla'] });
      setCancelDialogOpen(false);
      setSelectedInvite(null);
      toast({
        title: 'Onboarding Cancelled',
        description: 'School onboarding has been cancelled and token invalidated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel onboarding',
        variant: 'destructive',
      });
    },
  });

  const createInviteMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await superAdminOnboardingApi.createSchoolInvite(data, user?.email || 'superadmin@eddge.com');
    },
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'onboarding-queue'] });
      setCreateDialogOpen(false);
      setFormData({
        schoolName: '',
        board: '',
        contactEmail: '',
        phone: '',
        location: '',
        initialPlan: 'Standard',
        lifecycleState: 'TRIAL',
      });
      toast({
        title: 'Invite sent successfully',
        description: `Onboarding invite sent to ${invite.contactEmail}. Token: ${invite.token}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create invite',
        variant: 'destructive',
      });
    },
  });

  const handleCreateInvite = () => {
    if (!formData.schoolName || !formData.contactEmail || !formData.board || !formData.phone || !formData.location || !formData.initialPlan || !formData.lifecycleState) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createInviteMutation.mutate(formData);
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
    toast({
      title: 'Token Copied',
      description: 'Onboarding token copied to clipboard',
    });
  };

  const getStatusBadge = (status: SchoolOnboardingInvite['onboardingStatus']) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      INVITED: 'outline',
      IN_PROGRESS: 'secondary',
      SUBMITTED: 'default',
      APPROVED: 'default',
      ACTIVE: 'default',
      SUSPENDED: 'destructive',
      CANCELLED: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status.replace('_', ' ')}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const isTokenExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getSLAWarning = (inviteId: string) => {
    return slaData?.find(s => s.inviteId === inviteId);
  };

  const computeDaysInState = (invite: SchoolOnboardingInvite): number => {
    const now = new Date();
    const referenceDate = new Date(invite.invitedAt);
    return Math.floor((now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Filter queue by status
  const filteredQueue = queue?.filter((invite) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'stuck') {
      const warning = getSLAWarning(invite.id);
      return warning?.isStuck || false;
    }
    return invite.onboardingStatus === statusFilter;
  }) || [];

  const stuckCount = slaData?.filter(s => s.isStuck).length || 0;

  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/551a3c41-c60e-4d3d-a721-a180211fd5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SuperAdminOnboarding.tsx:222',message:'Component render - access level check',data:{accessLevel,canModify,stuckCount,createDialogOpen},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    setTimeout(() => {
      const button = document.querySelector('[data-testid="add-new-school-btn"]') || document.querySelector('button:has-text("Add New School")') || Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Add New School'));
      if (button) {
        const styles = window.getComputedStyle(button);
        const htmlButton = button as HTMLElement;
        fetch('http://127.0.0.1:7244/ingest/551a3c41-c60e-4d3d-a721-a180211fd5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SuperAdminOnboarding.tsx:225',message:'Button found in DOM - checking styles',data:{display:styles.display,visibility:styles.visibility,opacity:styles.opacity,width:styles.width,height:styles.height,position:styles.position,zIndex:styles.zIndex,isVisible:htmlButton.offsetParent !== null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      } else {
        fetch('http://127.0.0.1:7244/ingest/551a3c41-c60e-4d3d-a721-a180211fd5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SuperAdminOnboarding.tsx:228',message:'Button NOT found in DOM',data:{allButtons:Array.from(document.querySelectorAll('button')).map(b => ({text:b.textContent,classes:b.className}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      }
    }, 100);
  }, [accessLevel, canModify, stuckCount, createDialogOpen]);
  // #endregion

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-3 md:space-y-6">
        {/* Operations Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">School Onboarding</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Manage new school onboarding and activation
            </p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {stuckCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter('stuck')}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Stuck ({stuckCount})
              </Button>
            )}
            {canModify && (
              <Button 
                data-testid="add-new-school-btn"
                onClick={() => {
                  // #region agent log
                  fetch('http://127.0.0.1:7244/ingest/551a3c41-c60e-4d3d-a721-a180211fd5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SuperAdminOnboarding.tsx:260',message:'Add New School button clicked',data:{canModify,accessLevel},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                  // #endregion
                  setCreateDialogOpen(true);
                }} 
                className="bg-primary hover:bg-primary/90 text-white font-medium shadow-md"
                size="default"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New School
              </Button>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="INVITED">Invited</TabsTrigger>
            <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
            <TabsTrigger value="SUBMITTED">Submitted</TabsTrigger>
            <TabsTrigger value="stuck">
              Stuck {stuckCount > 0 && `(${stuckCount})`}
            </TabsTrigger>
            <TabsTrigger value="SUSPENDED">Suspended</TabsTrigger>
            <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Onboarding Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Queue</CardTitle>
            <CardDescription>View all school onboarding invites and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading onboarding queue..." />
            ) : isError || !queue || queue.length === 0 ? (
              <EmptyState
                icon={School}
                title="No onboarding invites"
                description="Create your first school onboarding invite to get started."
              />
            ) : filteredQueue.length === 0 ? (
              <EmptyState
                icon={School}
                title={`No ${statusFilter === 'all' ? '' : statusFilter.replace('_', ' ').toLowerCase()} schools`}
                description="No schools match the selected filter."
              />
            ) : (
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Invited</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueue.map((invite) => {
                    const slaWarning = getSLAWarning(invite.id);
                    const daysInState = computeDaysInState(invite);
                    return (
                      <TableRow key={invite.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {invite.schoolName}
                            {slaWarning && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {slaWarning.warningLabel} ({slaWarning.daysInState}d)
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {invite.contactEmail}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {invite.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {invite.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{invite.initialPlan}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(invite.onboardingStatus)}
                            {(invite.onboardingStatus === 'INVITED' || invite.onboardingStatus === 'IN_PROGRESS') && (
                              <span className="text-xs text-muted-foreground">{daysInState} days</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={invite.onboardingProgress} className="w-20" />
                            <span className="text-xs text-muted-foreground">{invite.onboardingProgress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">{invite.token.substring(0, 20)}...</code>
                            {isTokenExpired(invite.tokenExpiresAt) ? (
                              <Badge variant="destructive" className="text-xs">Expired</Badge>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToken(invite.token)}
                              >
                                {copiedToken === invite.token ? (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(invite.invitedAt)}
                        </TableCell>
                        <TableCell>
                          {canModify && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {(invite.onboardingStatus === 'INVITED' || invite.onboardingStatus === 'IN_PROGRESS') && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedInvite(invite);
                                        setResendDialogOpen(true);
                                      }}
                                    >
                                      <MailIcon className="h-4 w-4 mr-2" />
                                      Resend Invite
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedInvite(invite);
                                        setRegenerateDialogOpen(true);
                                      }}
                                    >
                                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                                      Regenerate Token
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedInvite(invite);
                                        setCancelDialogOpen(true);
                                      }}
                                      className="text-red-600"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Cancel Onboarding
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {invite.onboardingStatus === 'SUBMITTED' && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedInvite(invite);
                                      setCancelDialogOpen(true);
                                    }}
                                    className="text-red-600"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel Onboarding
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Invite Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Invite School to EDDGE</DialogTitle>
              <DialogDescription>
                Create a new onboarding invite. A one-time token will be generated and sent to the contact email.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <Label htmlFor="board">Board *</Label>
                  <Select
                    value={formData.board}
                    onValueChange={(value) => setFormData({ ...formData, board: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                      <SelectItem value="State Board">State Board</SelectItem>
                      <SelectItem value="IB">IB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="admin@school.edu"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 11 2345 6789"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, State"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="initialPlan">Initial Plan *</Label>
                  <Select
                    value={formData.initialPlan}
                    onValueChange={(value) => setFormData({ ...formData, initialPlan: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lifecycleState">Initial Lifecycle *</Label>
                  <Select
                    value={formData.lifecycleState}
                    onValueChange={(value: LifecycleState) => setFormData({ ...formData, lifecycleState: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRIAL">TRIAL</SelectItem>
                      <SelectItem value="PILOT">PILOT</SelectItem>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInvite} disabled={createInviteMutation.isPending}>
                {createInviteMutation.isPending ? 'Creating...' : 'Create Invite'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Resend Invite Confirmation Dialog */}
        <AlertDialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resend Onboarding Invite</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to resend the onboarding invite email to {selectedInvite?.contactEmail}?
                This will send a reminder email with the current onboarding link.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedInvite && resendInviteMutation.mutate(selectedInvite.id)}
                disabled={resendInviteMutation.isPending}
              >
                {resendInviteMutation.isPending ? 'Sending...' : 'Resend Invite'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Regenerate Token Confirmation Dialog */}
        <AlertDialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Regenerate Onboarding Token</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to regenerate the onboarding token for {selectedInvite?.schoolName}?
                This will invalidate the previous token and generate a new one-time token valid for 24 hours.
                The school admin will need to use the new token to access the onboarding wizard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedInvite && regenerateTokenMutation.mutate(selectedInvite.id)}
                disabled={regenerateTokenMutation.isPending}
              >
                {regenerateTokenMutation.isPending ? 'Regenerating...' : 'Regenerate Token'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Cancel Onboarding Confirmation Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Onboarding</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel onboarding for {selectedInvite?.schoolName}?
                This will:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Mark the onboarding as CANCELLED</li>
                  <li>Invalidate the onboarding token</li>
                  <li>Prevent the school admin from accessing the onboarding wizard</li>
                </ul>
                This action can only be performed for schools in INVITED, IN_PROGRESS, or SUBMITTED status.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Onboarding</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedInvite && cancelOnboardingMutation.mutate(selectedInvite.id)}
                disabled={cancelOnboardingMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {cancelOnboardingMutation.isPending ? 'Cancelling...' : 'Cancel Onboarding'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Email Preview Dialog */}
        <Dialog open={emailPreviewDialogOpen} onOpenChange={setEmailPreviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
              <DialogDescription>
                This is a preview of the email that would be sent (mock delivery only).
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

export default SuperAdminOnboarding;

