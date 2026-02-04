import { useState } from 'react';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminAdminsApi, superAdminAuditApi, type InternalAdminUser, type AdminRole } from '@/services/superAdminApi';
import { LoadingState } from '@/components/shared/LoadingState';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, UserPlus, Edit2, Ban, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SuperAdminAdmins = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createConfirmOpen, setCreateConfirmOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [disableConfirmOpen, setDisableConfirmOpen] = useState(false);
  const [roleChangeConfirmOpen, setRoleChangeConfirmOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<InternalAdminUser | null>(null);

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('OPS');

  const [roleValue, setRoleValue] = useState<AdminRole>('OPS');

  const { data, isLoading, isRefetching, refetch } = useQuery<InternalAdminUser[]>({
    queryKey: ['superadmin', 'admins'],
    queryFn: () => superAdminAdminsApi.getAdmins(),
  });

  const logAction = async (action: string, target: string, metadata?: string) => {
    try {
      await superAdminAuditApi.logAdminAction({
        actor: user?.email || 'superadmin@eddge.com',
        action,
        target,
        metadata,
      });
    } catch {
      // ignore
    }
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const created = await superAdminAdminsApi.createAdmin({
        email: newAdminEmail,
        name: newAdminName,
        role: newAdminRole,
      });
      await logAction('ADMIN_CREATED', created.id, `role=${created.role}`);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'admins'] });
      setCreateDialogOpen(false);
      setCreateConfirmOpen(false);
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminRole('OPS');
      toast({ title: 'Admin created', description: 'New internal admin created successfully.' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create admin',
        variant: 'destructive',
      });
    },
  });

  const handleCreateConfirm = () => {
    if (!newAdminEmail || !newAdminName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    setCreateDialogOpen(false);
    setCreateConfirmOpen(true);
  };

  const updateRoleMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAdmin) return;
      await superAdminAdminsApi.updateAdminRole(selectedAdmin.id, roleValue, user?.email || '');
      await logAction('ADMIN_ROLE_CHANGED', selectedAdmin.id, `role=${roleValue}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'admins'] });
      setEditDialogOpen(false);
      toast({ title: 'Role updated', description: 'Admin role updated successfully.' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role',
        variant: 'destructive',
      });
    },
  });

  const disableMutation = useMutation({
    mutationFn: async (admin: InternalAdminUser) => {
      await superAdminAdminsApi.disableAdmin(admin.id, user?.email || '');
      await logAction('DISABLE_INTERNAL_ADMIN', admin.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'admins'] });
      setDisableConfirmOpen(false);
      toast({ title: 'Admin disabled', description: 'Admin access has been disabled.' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to disable admin',
        variant: 'destructive',
      });
    },
  });

  const handleDisableClick = (admin: InternalAdminUser) => {
    if (admin.email === user?.email) {
      toast({
        title: 'Cannot disable yourself',
        description: 'You cannot disable your own account.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedAdmin(admin);
    setDisableConfirmOpen(true);
  };

  const handleRoleChangeClick = (admin: InternalAdminUser) => {
    if (admin.email === user?.email) {
      toast({
        title: 'Cannot change your own role',
        description: 'You cannot change your own role. Please ask another ROOT admin.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedAdmin(admin);
    setRoleValue(admin.role);
    setRoleChangeConfirmOpen(true);
  };

  const handleRoleChangeConfirm = () => {
    setRoleChangeConfirmOpen(false);
    setEditDialogOpen(true);
  };

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admins &amp; Roles</h1>
            <p className="text-muted-foreground">
              Manage internal SuperAdmin-level accounts. School admins and end-user roles are not shown here.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              New Admin
            </Button>
          </div>
        </div>

        {/* Info banner */}
        <Card className="border-sky-200 bg-sky-50">
          <CardContent className="py-3 flex items-start gap-3">
            <Shield className="h-5 w-5 text-sky-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-sky-900">
                ROOT, OPS, and FINANCE are internal roles.
              </p>
              <p className="text-xs text-sky-800">
                Self-demotion and self-disable are blocked. All changes are captured in the SuperAdmin Action Audit.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Admins table */}
        <Card>
          <CardHeader>
            <CardTitle>Internal Admins</CardTitle>
            <CardDescription>Only SuperAdmin-side internal accounts. No school admins or end-users are listed.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading internal admins..." />
            ) : !data || data.length === 0 ? (
              <p className="text-sm text-muted-foreground">No internal admins configured yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{admin.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.is_active ? 'default' : 'secondary'}>
                          {admin.is_active ? 'Active' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {admin.last_login_at === '—'
                          ? '—'
                          : new Date(admin.last_login_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRoleChangeClick(admin)}
                            disabled={!admin.is_active || admin.email === user?.email}
                            title={admin.email === user?.email ? 'You cannot change your own role' : ''}
                          >
                            <Edit2 className="mr-1 h-4 w-4" />
                            Role
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDisableClick(admin)}
                            disabled={!admin.is_active || admin.email === user?.email}
                            title={admin.email === user?.email ? 'You cannot disable your own account' : ''}
                          >
                            <Ban className="mr-1 h-4 w-4" />
                            Disable
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

        {/* Create Admin Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Internal Admin</DialogTitle>
              <DialogDescription>
                Create a new internal admin with ROOT, OPS, or FINANCE role. This does not create any school-level admin.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Name</Label>
                <Input
                  id="admin-name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Admin full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@eddge.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newAdminRole} onValueChange={(value) => setNewAdminRole(value as AdminRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROOT">ROOT</SelectItem>
                    <SelectItem value="OPS">OPS</SelectItem>
                    <SelectItem value="FINANCE">FINANCE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateConfirm}
                  disabled={!newAdminEmail || !newAdminName}
                >
                  Continue
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Role Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Admin Role</DialogTitle>
              <DialogDescription>
                Change the role for <span className="font-semibold">{selectedAdmin?.email}</span>. You cannot change your own role.
              </DialogDescription>
            </DialogHeader>
            {selectedAdmin && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={roleValue} onValueChange={(v) => setRoleValue(v as AdminRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROOT">ROOT</SelectItem>
                      <SelectItem value="OPS">OPS</SelectItem>
                      <SelectItem value="FINANCE">FINANCE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateRoleMutation.mutate()}
                    disabled={updateRoleMutation.isPending || selectedAdmin?.email === user?.email}
                  >
                    {updateRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Disable Admin Confirmation Dialog */}
        <AlertDialog open={disableConfirmOpen} onOpenChange={setDisableConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disable Admin Access?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to disable access for <span className="font-semibold">{selectedAdmin?.email}</span>?
                This will prevent them from logging in to the SuperAdmin dashboard. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedAdmin && disableMutation.mutate(selectedAdmin)}
                disabled={disableMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {disableMutation.isPending ? 'Disabling...' : 'Disable Admin'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Create Admin Confirmation Dialog */}
        <AlertDialog open={createConfirmOpen} onOpenChange={setCreateConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Internal Admin?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to create a new internal admin with the following details:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><span className="font-semibold">Name:</span> {newAdminName}</li>
                  <li><span className="font-semibold">Email:</span> {newAdminEmail}</li>
                  <li><span className="font-semibold">Role:</span> {newAdminRole}</li>
                </ul>
                This will grant them access to the SuperAdmin dashboard. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCreateDialogOpen(true)}>Back</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Admin'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Role Change Confirmation Dialog */}
        <AlertDialog open={roleChangeConfirmOpen} onOpenChange={setRoleChangeConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change Admin Role?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to change the role for <span className="font-semibold">{selectedAdmin?.email}</span>.
                This will affect their access permissions. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRoleChangeConfirm}>
                Continue to Role Selection
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminAdmins;


