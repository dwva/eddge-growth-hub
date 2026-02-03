import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import SuperAdminDashboardLayout from '@/components/layout/SuperAdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { superAdminApi, BillingPlan, BillingRenewal, Invoice } from '@/services/superAdminApi';
import { CreditCard, Calendar, CheckCircle2, Building2 } from 'lucide-react';

const SuperAdminBilling = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [invoicePage, setInvoicePage] = useState(1);

  const { data: plansData, isLoading: plansLoading } = useQuery<BillingPlan[]>({
    queryKey: ["superadmin", "billing-plans"],
    queryFn: () => superAdminApi.getBillingPlans(),
  });

  const { data: schoolsData } = useQuery({
    queryKey: ["superadmin", "schools", 1, ''],
    queryFn: () => superAdminApi.getSchools(1, 1000, ''),
  });

  const { data: renewalsData, isLoading: renewalsLoading } = useQuery<BillingRenewal[]>({
    queryKey: ["superadmin", "billing-renewals"],
    queryFn: () => superAdminApi.getBillingRenewals(30),
  });

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ["superadmin", "billing-invoices", invoicePage],
    queryFn: () => superAdminApi.getBillingInvoices(invoicePage, 50),
  });

  // Calculate subscription overview
  const subscriptionOverview = useMemo(() => {
    if (!schoolsData?.schools) return { Basic: 0, Standard: 0, Premium: 0 };
    const overview = { Basic: 0, Standard: 0, Premium: 0 };
    schoolsData.schools.forEach(school => {
      const plan = school.subscription_status as 'Basic' | 'Standard' | 'Premium';
      if (overview.hasOwnProperty(plan)) {
        overview[plan]++;
      }
    });
    return overview;
  }, [schoolsData]);

  // Calculate invoice status counts
  const invoiceStatusCounts = useMemo(() => {
    if (!invoicesData?.invoices) return { paid: 0, pending: 0, overdue: 0 };
    const counts = { paid: 0, pending: 0, overdue: 0 };
    invoicesData.invoices.forEach((invoice: Invoice) => {
      if (invoice.status === 'paid') counts.paid++;
      else if (invoice.status === 'pending') counts.pending++;
      else if (invoice.status === 'overdue') counts.overdue++;
    });
    return counts;
  }, [invoicesData]);

  return (
    <SuperAdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Billing & Plans</h1>
          <p className="text-muted-foreground">Manage school subscriptions and billing</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Subscription Overview</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="renewals">Renewals</TabsTrigger>
            <TabsTrigger value="invoices">Invoice History</TabsTrigger>
          </TabsList>

          {/* Subscription Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Basic Plan</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{subscriptionOverview.Basic}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total schools</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Standard Plan</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{subscriptionOverview.Standard}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total schools</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Premium Plan</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{subscriptionOverview.Premium}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total schools</p>
                </CardContent>
              </Card>
            </div>

            {/* Renewals Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Renewals (Next 30 Days)</CardTitle>
                <CardDescription>Subscriptions renewing soon</CardDescription>
              </CardHeader>
              <CardContent>
                {renewalsLoading ? (
                  <LoadingState message="Loading renewals..." />
                ) : !renewalsData || renewalsData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No renewals scheduled in the next 30 days</p>
                ) : (
                  <div className="text-2xl font-bold">{renewalsData.length}</div>
                )}
              </CardContent>
            </Card>

            {/* Invoice Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Status Summary</CardTitle>
                <CardDescription>Current invoice status counts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{invoiceStatusCounts.paid}</div>
                    <p className="text-xs text-muted-foreground mt-1">Paid</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{invoiceStatusCounts.pending}</div>
                    <p className="text-xs text-muted-foreground mt-1">Pending</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{invoiceStatusCounts.overdue}</div>
                    <p className="text-xs text-muted-foreground mt-1">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-4">
            {plansLoading ? (
              <LoadingState message="Loading plans..." />
            ) : !plansData || plansData.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No plans found"
                description="Subscription plans will appear here"
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {plansData.map((plan) => (
                  <Card key={plan.id} className="relative">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        <div className="mt-2">
                          <div className="text-2xl font-bold text-foreground">${plan.price_monthly}</div>
                          <div className="text-sm text-muted-foreground">per month</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            or ${plan.price_yearly}/year (save ${(plan.price_monthly * 12 - plan.price_yearly).toFixed(0)})
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Renewals Tab */}
          <TabsContent value="renewals" className="space-y-4">
            {renewalsLoading ? (
              <LoadingState message="Loading renewals..." />
            ) : !renewalsData || renewalsData.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming renewals"
                description="There are no renewals scheduled in the next 30 days"
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Renewals</CardTitle>
                  <CardDescription>Subscriptions renewing in the next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>School</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Renewal Date</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {renewalsData.map((renewal) => (
                        <TableRow key={renewal.school_id}>
                          <TableCell className="font-medium">{renewal.school_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{renewal.plan_name}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(renewal.renewal_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">${renewal.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            {invoicesLoading ? (
              <LoadingState message="Loading invoices..." />
            ) : !invoicesData || invoicesData.invoices.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No invoices found"
                description="Invoice history will appear here"
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Invoice History</CardTitle>
                  <CardDescription>All billing invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Paid Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoicesData.invoices.map((invoice: Invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono text-xs">{invoice.id.slice(0, 8)}...</TableCell>
                          <TableCell className="font-medium">{invoice.school_name}</TableCell>
                          <TableCell className="font-medium">${invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                invoice.status === "paid"
                                  ? "default"
                                  : invoice.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                          <TableCell>{invoice.paid_date ? new Date(invoice.paid_date).toLocaleDateString() : "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {invoicesData.total > 50 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {invoicePage} of {Math.ceil(invoicesData.total / 50)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInvoicePage(p => Math.max(1, p - 1))}
                          disabled={invoicePage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInvoicePage(p => p + 1)}
                          disabled={invoicePage * 50 >= invoicesData.total}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminBilling;

