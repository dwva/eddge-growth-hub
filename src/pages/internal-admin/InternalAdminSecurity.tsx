import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import InternalAdminDashboardLayout from '@/components/layout/InternalAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { internalAdminApi, AuditLog, AccessLog, ComplianceLog } from '@/services/internalAdminApi';
import { Shield, Lock, AlertCircle, Search, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InternalAdminSecurity = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [auditPage, setAuditPage] = useState(1);
  const [auditUserId, setAuditUserId] = useState('');
  const [accessPage, setAccessPage] = useState(1);
  const [accessUserId, setAccessUserId] = useState('');
  const [compliancePage, setCompliancePage] = useState(1);
  const [complianceType, setComplianceType] = useState('');
  const { toast } = useToast();

  const { data: auditData, isLoading: auditLoading } = useQuery({
    queryKey: ["internal-admin", "audit-logs", auditPage, auditUserId],
    queryFn: () => internalAdminApi.getAuditLogs(auditPage, 20, auditUserId || undefined),
  });

  const { data: accessData, isLoading: accessLoading } = useQuery({
    queryKey: ["internal-admin", "access-logs", accessPage, accessUserId],
    queryFn: () => internalAdminApi.getAccessLogs(accessPage, 20, accessUserId || undefined),
  });

  const { data: complianceData, isLoading: complianceLoading } = useQuery({
    queryKey: ["internal-admin", "compliance-logs", compliancePage, complianceType],
    queryFn: () => internalAdminApi.getComplianceLogs(compliancePage, 20, complianceType || undefined),
  });

  const handleExport = (type: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${type} logs...`,
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <InternalAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Security & Compliance</h1>
          <p className="text-muted-foreground">Admin audit trail, access logs, and DPDP compliance logs</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            <TabsTrigger value="access">Access Logs</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Logs</TabsTrigger>
          </TabsList>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Admin Audit Trail
                    </CardTitle>
                    <CardDescription>All admin actions and system changes</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleExport("audit")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filter */}
                <div className="mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Filter by user ID..."
                      value={auditUserId}
                      onChange={(e) => {
                        setAuditUserId(e.target.value);
                        setAuditPage(1);
                      }}
                      className="pl-8"
                    />
                  </div>
                </div>

                {auditLoading ? (
                  <LoadingState message="Loading audit logs..." />
                ) : !auditData || auditData.logs.length === 0 ? (
                  <EmptyState
                    icon={Shield}
                    title="No audit logs found"
                    description="Audit logs will appear here"
                  />
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Resource</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditData.logs.map((log: AuditLog) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-mono text-xs">{log.user_id.slice(0, 8)}...</TableCell>
                            <TableCell>
                              <Badge variant="outline">{log.action}</Badge>
                            </TableCell>
                            <TableCell>{log.resource}</TableCell>
                            <TableCell className="font-mono text-xs">{log.ip_address || "N/A"}</TableCell>
                            <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {auditData.total > 20 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Page {auditPage} of {Math.ceil(auditData.total / 20)}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setAuditPage(p => Math.max(1, p - 1))} disabled={auditPage === 1}>
                            Previous
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setAuditPage(p => p + 1)} disabled={auditPage * 20 >= auditData.total}>
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Logs Tab */}
          <TabsContent value="access" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Access Logs
                    </CardTitle>
                    <CardDescription>API access and authentication logs</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleExport("access")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filter */}
                <div className="mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Filter by user ID..."
                      value={accessUserId}
                      onChange={(e) => {
                        setAccessUserId(e.target.value);
                        setAccessPage(1);
                      }}
                      className="pl-8"
                    />
                  </div>
                </div>

                {accessLoading ? (
                  <LoadingState message="Loading access logs..." />
                ) : !accessData || accessData.logs.length === 0 ? (
                  <EmptyState
                    icon={Lock}
                    title="No access logs found"
                    description="Access logs will appear here"
                  />
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Endpoint</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accessData.logs.map((log: AccessLog) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-mono text-xs">{log.user_id.slice(0, 8)}...</TableCell>
                            <TableCell className="font-mono text-xs">{log.endpoint}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{log.method}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  log.status_code >= 200 && log.status_code < 300
                                    ? "default"
                                    : log.status_code >= 400 && log.status_code < 500
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {log.status_code}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{log.ip_address || "N/A"}</TableCell>
                            <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {accessData.total > 20 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Page {accessPage} of {Math.ceil(accessData.total / 20)}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setAccessPage(p => Math.max(1, p - 1))} disabled={accessPage === 1}>
                            Previous
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setAccessPage(p => p + 1)} disabled={accessPage * 20 >= accessData.total}>
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Logs Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      DPDP Compliance Logs
                    </CardTitle>
                    <CardDescription>Data protection and privacy compliance events</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleExport("compliance")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filter */}
                <div className="mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Filter by compliance type..."
                      value={complianceType}
                      onChange={(e) => {
                        setComplianceType(e.target.value);
                        setCompliancePage(1);
                      }}
                      className="pl-8"
                    />
                  </div>
                </div>

                {complianceLoading ? (
                  <LoadingState message="Loading compliance logs..." />
                ) : !complianceData || complianceData.logs.length === 0 ? (
                  <EmptyState
                    icon={AlertCircle}
                    title="No compliance logs found"
                    description="Compliance logs will appear here"
                  />
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>User ID</TableHead>
                          <TableHead>School ID</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {complianceData.logs.map((log: ComplianceLog) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              <Badge variant="outline">{log.event_type}</Badge>
                            </TableCell>
                            <TableCell>{log.description}</TableCell>
                            <TableCell className="font-mono text-xs">{log.user_id?.slice(0, 8) || "N/A"}...</TableCell>
                            <TableCell className="font-mono text-xs">{log.school_id?.slice(0, 8) || "N/A"}...</TableCell>
                            <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {complianceData.total > 20 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Page {compliancePage} of {Math.ceil(complianceData.total / 20)}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setCompliancePage(p => Math.max(1, p - 1))} disabled={compliancePage === 1}>
                            Previous
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setCompliancePage(p => p + 1)} disabled={compliancePage * 20 >= complianceData.total}>
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </InternalAdminDashboardLayout>
  );
};

export default InternalAdminSecurity;
