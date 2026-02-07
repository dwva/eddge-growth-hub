import { useState } from 'react';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Search,
  Download,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const revenueData = [
  { month: 'Sep', revenue: 850000 },
  { month: 'Oct', revenue: 920000 },
  { month: 'Nov', revenue: 880000 },
  { month: 'Dec', revenue: 950000 },
  { month: 'Jan', revenue: 1100000 },
  { month: 'Feb', revenue: 980000 },
];

const feeCollectionData = [
  { class: '9-A', total: 36, paid: 32, pending: 4, amount: '₹12,80,000' },
  { class: '9-B', total: 32, paid: 30, pending: 2, amount: '₹12,00,000' },
  { class: '10-A', total: 34, paid: 28, pending: 6, amount: '₹11,20,000' },
  { class: '10-B', total: 28, paid: 26, pending: 2, amount: '₹10,40,000' },
  { class: '11-A', total: 25, paid: 24, pending: 1, amount: '₹9,60,000' },
];

const recentTransactions = [
  { id: 1, student: 'Alex Johnson', class: '10-A', amount: '₹40,000', type: 'fee', status: 'completed', date: '2026-02-02' },
  { id: 2, student: 'Emma Wilson', class: '10-B', amount: '₹40,000', type: 'fee', status: 'completed', date: '2026-02-02' },
  { id: 3, student: 'Rahul Sharma', class: '9-A', amount: '₹40,000', type: 'fee', status: 'pending', date: '2026-02-01' },
  { id: 4, student: 'Priya Patel', class: '10-A', amount: '₹5,000', type: 'transport', status: 'completed', date: '2026-02-01' },
  { id: 5, student: 'David Brown', class: '11-A', amount: '₹40,000', type: 'fee', status: 'overdue', date: '2026-01-28' },
];

const AdminFinance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  return (
    <AdminDashboardLayout 
      pageTitle="Finance" 
      pageDescription="Manage fees and financial records"
    >
      <div className="space-y-3 md:space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">₹98L</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">₹85L</div>
                <div className="text-sm text-muted-foreground">Collected</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">₹10L</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">₹3L</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `₹${value/100000}L`} />
                  <Tooltip 
                    formatter={(value: number) => [`₹${(value/100000).toFixed(1)}L`, 'Revenue']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#colorRevenue)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-3 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Record Payment
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <CreditCard className="w-4 h-4" />
                Send Fee Reminders
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Fee Collection by Class */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Fee Collection by Class</CardTitle>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeCollectionData.map((cls) => (
                <div key={cls.class} className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Class {cls.class}</div>
                        <div className="text-sm text-muted-foreground">{cls.amount}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{cls.paid}/{cls.total} paid</div>
                      <div className="text-sm text-muted-foreground">{cls.pending} pending</div>
                    </div>
                  </div>
                  <Progress value={(cls.paid / cls.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{tx.student}</td>
                      <td className="px-6 py-4 text-muted-foreground">{tx.class}</td>
                      <td className="px-6 py-4 font-medium">{tx.amount}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="capitalize">{tx.type}</Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Badge className={
                          tx.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                          tx.status === 'pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                          'bg-red-100 text-red-700 hover:bg-red-100'
                        }>
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminFinance;
