// SuperAdmin API Service with Mock Data
// Base route: /api/v1/superadmin
// Includes JWT token validation simulation and access level checks

import { getStoredToken, validateToken, type AccessLevel } from './jwtAuthService';

// Re-export types from internalAdminApi for consistency
export type {
  PlatformOverview,
  School,
  SchoolSubscription,
  UsageAnalytics,
  BillingPlan,
  BillingRenewal,
  Invoice,
  SystemHealth,
  AuditLog,
  AccessLog,
  ComplianceLog
} from './internalAdminApi';

import type {
  PlatformOverview,
  School,
  SchoolSubscription,
  UsageAnalytics,
  BillingPlan,
  BillingRenewal,
  Invoice,
  SystemHealth,
  AuditLog,
  AccessLog,
  ComplianceLog
} from './internalAdminApi';

// Mock Data (same as internalAdminApi but isolated)
const mockSchools: School[] = [
  { id: "sch-001", name: "Delhi Public School", email: "admin@dps.edu", phone: "+91 11 2345 6789", address: "New Delhi", is_active: true, subscription_status: "Premium", created_at: "2023-01-15", lifecycle_state: "ACTIVE" },
  { id: "sch-002", name: "St. Mary's Academy", email: "contact@stmarys.edu", phone: "+91 22 3456 7890", address: "Mumbai", is_active: true, subscription_status: "Standard", created_at: "2023-02-20", lifecycle_state: "PILOT" },
  { id: "sch-003", name: "Kendriya Vidyalaya", email: "kv@gov.in", phone: "+91 80 4567 8901", address: "Bangalore", is_active: true, subscription_status: "Premium", created_at: "2023-03-10", lifecycle_state: "ACTIVE" },
  { id: "sch-004", name: "Modern School", email: "info@modernschool.edu", phone: "+91 44 5678 9012", address: "Chennai", is_active: false, subscription_status: "Basic", created_at: "2023-04-05", lifecycle_state: "SUSPENDED" },
  { id: "sch-005", name: "DAV Public School", email: "dav@dav.edu", phone: "+91 33 6789 0123", address: "Kolkata", is_active: true, subscription_status: "Standard", created_at: "2023-05-12", lifecycle_state: "ACTIVE" },
  { id: "sch-006", name: "Ryan International", email: "ryan@ryanint.edu", phone: "+91 40 7890 1234", address: "Hyderabad", is_active: true, subscription_status: "Premium", created_at: "2023-06-18", lifecycle_state: "ACTIVE" },
  { id: "sch-007", name: "Army Public School", email: "aps@army.edu", phone: "+91 79 8901 2345", address: "Ahmedabad", is_active: true, subscription_status: "Standard", created_at: "2023-07-22", lifecycle_state: "PILOT" },
  { id: "sch-008", name: "Springdales School", email: "spring@springdales.edu", phone: "+91 141 9012 3456", address: "Jaipur", is_active: false, subscription_status: "Basic", created_at: "2023-08-30", lifecycle_state: "CHURNED" },
  { id: "sch-009", name: "The Heritage School", email: "heritage@heritage.edu", phone: "+91 522 0123 4567", address: "Lucknow", is_active: true, subscription_status: "Premium", created_at: "2023-09-15", lifecycle_state: "ACTIVE" },
  { id: "sch-010", name: "Bishop Cotton School", email: "bishop@bcotton.edu", phone: "+91 20 1234 5678", address: "Pune", is_active: true, subscription_status: "Standard", created_at: "2023-10-08", lifecycle_state: "TRIAL" },
  { id: "sch-011", name: "La Martiniere College", email: "lam@lamart.edu", phone: "+91 172 2345 6789", address: "Chandigarh", is_active: true, subscription_status: "Premium", created_at: "2023-11-20", lifecycle_state: "ACTIVE" },
  { id: "sch-012", name: "Scindia School", email: "scindia@scindia.edu", phone: "+91 751 3456 7890", address: "Gwalior", is_active: true, subscription_status: "Basic", created_at: "2023-12-05", lifecycle_state: "TRIAL" },
];

const mockPlans: BillingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price_monthly: 99,
    price_yearly: 990,
    features: ["Up to 100 students", "5 teachers", "Basic analytics", "Email support"]
  },
  {
    id: "standard",
    name: "Standard",
    price_monthly: 199,
    price_yearly: 1990,
    features: ["Up to 500 students", "25 teachers", "Advanced analytics", "AI features", "Priority support"]
  },
  {
    id: "premium",
    name: "Premium",
    price_monthly: 399,
    price_yearly: 3990,
    features: ["Unlimited students", "Unlimited teachers", "Full analytics", "All AI features", "Custom integrations", "24/7 support"]
  }
];

const mockRenewals: BillingRenewal[] = [
  { school_id: "sch-001", school_name: "Delhi Public School", plan_name: "Premium", renewal_date: "2024-02-15", amount: 399 },
  { school_id: "sch-002", school_name: "St. Mary's Academy", plan_name: "Standard", renewal_date: "2024-02-18", amount: 199 },
  { school_id: "sch-005", school_name: "DAV Public School", plan_name: "Standard", renewal_date: "2024-02-22", amount: 199 },
  { school_id: "sch-006", school_name: "Ryan International", plan_name: "Premium", renewal_date: "2024-02-25", amount: 399 },
];

const mockInvoices: Invoice[] = [
  { id: "inv-001-abc123", school_name: "Delhi Public School", amount: 399, status: "paid", due_date: "2024-01-15", paid_date: "2024-01-14" },
  { id: "inv-002-def456", school_name: "St. Mary's Academy", amount: 199, status: "paid", due_date: "2024-01-18", paid_date: "2024-01-17" },
  { id: "inv-003-ghi789", school_name: "Modern School", amount: 99, status: "overdue", due_date: "2024-01-05" },
  { id: "inv-004-jkl012", school_name: "DAV Public School", amount: 199, status: "pending", due_date: "2024-02-12" },
  { id: "inv-005-mno345", school_name: "Ryan International", amount: 399, status: "paid", due_date: "2024-01-25", paid_date: "2024-01-24" },
  { id: "inv-006-pqr678", school_name: "Army Public School", amount: 199, status: "paid", due_date: "2024-01-22", paid_date: "2024-01-21" },
  { id: "inv-007-stu901", school_name: "Springdales School", amount: 99, status: "overdue", due_date: "2024-01-30" },
  { id: "inv-008-vwx234", school_name: "The Heritage School", amount: 399, status: "pending", due_date: "2024-02-15" },
];

const mockAuditLogs: AuditLog[] = [
  { id: "aud-001", user_id: "usr-admin-001", action: "UPDATE", resource: "school_settings", ip_address: "192.168.1.1", timestamp: "2024-01-15T10:30:00Z" },
  { id: "aud-002", user_id: "usr-admin-002", action: "CREATE", resource: "subscription", ip_address: "192.168.1.2", timestamp: "2024-01-15T11:45:00Z" },
  { id: "aud-003", user_id: "usr-admin-001", action: "DELETE", resource: "user_account", ip_address: "192.168.1.1", timestamp: "2024-01-15T12:00:00Z" },
  { id: "aud-004", user_id: "usr-admin-003", action: "UPDATE", resource: "billing_plan", ip_address: "192.168.1.3", timestamp: "2024-01-15T14:20:00Z" },
  { id: "aud-005", user_id: "usr-admin-002", action: "CREATE", resource: "school_account", ip_address: "192.168.1.2", timestamp: "2024-01-15T15:30:00Z" },
  { id: "aud-006", user_id: "usr-admin-001", action: "UPDATE", resource: "system_config", ip_address: "192.168.1.1", timestamp: "2024-01-15T16:45:00Z" },
  { id: "aud-007", user_id: "usr-admin-003", action: "DELETE", resource: "api_key", ip_address: "192.168.1.3", timestamp: "2024-01-16T09:00:00Z" },
  { id: "aud-008", user_id: "usr-admin-002", action: "CREATE", resource: "announcement", ip_address: "192.168.1.2", timestamp: "2024-01-16T10:15:00Z" },
];

const mockAccessLogs: AccessLog[] = [
  { id: "acc-001", user_id: "usr-001", endpoint: "/api/v1/superadmin/schools", method: "GET", status_code: 200, ip_address: "10.0.0.1", timestamp: "2024-01-15T10:00:00Z" },
  { id: "acc-002", user_id: "usr-002", endpoint: "/api/v1/superadmin/users", method: "POST", status_code: 201, ip_address: "10.0.0.2", timestamp: "2024-01-15T10:05:00Z" },
  { id: "acc-003", user_id: "usr-003", endpoint: "/api/v1/superadmin/billing", method: "GET", status_code: 200, ip_address: "10.0.0.3", timestamp: "2024-01-15T10:10:00Z" },
  { id: "acc-004", user_id: "usr-001", endpoint: "/api/v1/superadmin/auth", method: "POST", status_code: 401, ip_address: "10.0.0.1", timestamp: "2024-01-15T10:15:00Z" },
  { id: "acc-005", user_id: "usr-004", endpoint: "/api/v1/superadmin/reports", method: "GET", status_code: 500, ip_address: "10.0.0.4", timestamp: "2024-01-15T10:20:00Z" },
  { id: "acc-006", user_id: "usr-002", endpoint: "/api/v1/superadmin/schools/123", method: "PUT", status_code: 200, ip_address: "10.0.0.2", timestamp: "2024-01-15T10:25:00Z" },
  { id: "acc-007", user_id: "usr-005", endpoint: "/api/v1/superadmin/analytics", method: "GET", status_code: 200, ip_address: "10.0.0.5", timestamp: "2024-01-15T10:30:00Z" },
  { id: "acc-008", user_id: "usr-003", endpoint: "/api/v1/superadmin/users/456", method: "DELETE", status_code: 403, ip_address: "10.0.0.3", timestamp: "2024-01-15T10:35:00Z" },
];

const mockComplianceLogs: ComplianceLog[] = [
  { id: "comp-001", event_type: "DATA_ACCESS", description: "Bulk student data export requested", user_id: "usr-admin-001", school_id: "sch-001", timestamp: "2024-01-15T09:00:00Z" },
  { id: "comp-002", event_type: "DATA_DELETION", description: "User account deletion completed", user_id: "usr-admin-002", school_id: "sch-003", timestamp: "2024-01-15T10:30:00Z" },
  { id: "comp-003", event_type: "CONSENT_UPDATE", description: "Privacy consent updated for school", school_id: "sch-002", timestamp: "2024-01-15T11:45:00Z" },
  { id: "comp-004", event_type: "DATA_BREACH", description: "Potential breach detected and mitigated", timestamp: "2024-01-15T13:00:00Z" },
  { id: "comp-005", event_type: "DATA_ACCESS", description: "Parent data access request fulfilled", user_id: "usr-parent-001", school_id: "sch-005", timestamp: "2024-01-15T14:20:00Z" },
  { id: "comp-006", event_type: "AUDIT_COMPLETE", description: "Monthly DPDP compliance audit completed", timestamp: "2024-01-15T16:00:00Z" },
  { id: "comp-007", event_type: "DATA_RETENTION", description: "Old records archived per retention policy", school_id: "sch-001", timestamp: "2024-01-16T08:00:00Z" },
  { id: "comp-008", event_type: "CONSENT_UPDATE", description: "New data processing agreement signed", school_id: "sch-006", timestamp: "2024-01-16T09:30:00Z" },
];

// Simulated delay for async behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validate JWT token before API call
 * Simulates backend token validation
 */
function validateJWTToken(): AccessLevel | null {
  const token = getStoredToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const payload = validateToken(token);
  if (!payload) {
    throw new Error('Invalid or expired token');
  }

  if (payload.role !== 'superadmin') {
    throw new Error('Unauthorized: SuperAdmin access required');
  }

  return payload.accessLevel;
}

/**
 * Check if access level has permission for operation
 * ROOT has all permissions, OPS and FINANCE have limited permissions
 */
function hasPermission(accessLevel: AccessLevel, requiredLevel: 'ROOT' | 'OPS' | 'FINANCE' | 'ANY'): boolean {
  if (requiredLevel === 'ANY') return true;
  if (accessLevel === 'ROOT') return true;
  if (requiredLevel === 'OPS' && (accessLevel === 'OPS' || accessLevel === 'FINANCE')) return true;
  if (requiredLevel === 'FINANCE' && accessLevel === 'FINANCE') return true;
  return false;
}

export const superAdminApi = {
  getPlatformOverview: async (): Promise<PlatformOverview> => {
    await delay(500);
    validateJWTToken(); // Simulate token validation
    
    // Simulate real-time system status (mock data)
    const systemStatuses: Array<'operational' | 'degraded' | 'down'> = ['operational', 'operational', 'operational', 'degraded'];
    const randomStatus = systemStatuses[Math.floor(Math.random() * systemStatuses.length)];
    
    return {
      total_schools: 150,
      schools_breakdown: {
        active: 142,
        trial: 5,
        suspended: 3
      },
      total_users: 45000,
      daily_active_users: 12000,
      system_uptime_percentage: 99.8,
      system_status: randomStatus,
      new_schools_today: 2,
      new_users_today: 127,
      total_errors_24h: 3
    };
  },

  getSchools: async (page: number, pageSize: number, search?: string): Promise<{ schools: School[]; total: number }> => {
    await delay(400);
    const accessLevel = validateJWTToken();
    if (!hasPermission(accessLevel!, 'ANY')) {
      throw new Error('Insufficient permissions');
    }

    let filtered = mockSchools;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = mockSchools.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.email?.toLowerCase().includes(searchLower)
      );
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      schools: filtered.slice(start, end),
      total: filtered.length
    };
  },

  getSchoolSubscription: async (schoolId: string): Promise<SchoolSubscription> => {
    await delay(300);
    validateJWTToken();
    const school = mockSchools.find(s => s.id === schoolId);
    return {
      plan_name: school?.subscription_status || "Basic",
      subscription_status: school?.is_active ? "Active" : "Suspended",
      start_date: school?.created_at || "2023-01-01",
      renewal_date: "2024-03-01"
    };
  },

  updateSchoolLifecycle: async (schoolId: string, lifecycle_state: 'TRIAL' | 'PILOT' | 'ACTIVE' | 'SUSPENDED' | 'CHURNED'): Promise<void> => {
    await delay(400);
    const accessLevel = validateJWTToken();
    if (!hasPermission(accessLevel!, 'ROOT')) {
      throw new Error('Only ROOT access level can modify lifecycle state');
    }
    const school = mockSchools.find(s => s.id === schoolId);
    if (school) {
      // eslint-disable-next-line no-param-reassign
      (school as any).lifecycle_state = lifecycle_state;
    }
  },

  toggleSchoolStatus: async (schoolId: string, isActive: boolean): Promise<void> => {
    await delay(500);
    const accessLevel = validateJWTToken();
    if (!hasPermission(accessLevel!, 'ROOT')) {
      throw new Error('Only ROOT access level can modify school status');
    }

    const school = mockSchools.find(s => s.id === schoolId);
    if (school) {
      school.is_active = isActive;
    }
  },

  getUsageAnalytics: async (startDate: string, endDate: string): Promise<UsageAnalytics> => {
    await delay(600);
    validateJWTToken();
    return {
      user_growth: [
        { date: "2024-01-10", count: 45 },
        { date: "2024-01-11", count: 52 },
        { date: "2024-01-12", count: 38 },
        { date: "2024-01-13", count: 61 },
        { date: "2024-01-14", count: 55 },
        { date: "2024-01-15", count: 48 },
        { date: "2024-01-16", count: 67 }
      ],
      feature_usage: {
        doubt_solver: 15000,
        foundation_engine: 8000,
        assessments: 5000
      },
      ai_consumption: {
        total_requests: 500000,
        total_tokens: 75000000,
        cost_usd: 1250.50
      }
    };
  },

  getBillingPlans: async (): Promise<BillingPlan[]> => {
    await delay(300);
    validateJWTToken();
    return mockPlans;
  },

  getBillingRenewals: async (days: number): Promise<BillingRenewal[]> => {
    await delay(400);
    const accessLevel = validateJWTToken();
    if (!hasPermission(accessLevel!, 'FINANCE')) {
      throw new Error('FINANCE access level required for billing operations');
    }
    return mockRenewals;
  },

  getBillingInvoices: async (page: number, pageSize: number): Promise<{ invoices: Invoice[]; total: number }> => {
    await delay(400);
    const accessLevel = validateJWTToken();
    if (!hasPermission(accessLevel!, 'FINANCE')) {
      throw new Error('FINANCE access level required for invoice access');
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      invoices: mockInvoices.slice(start, end),
      total: mockInvoices.length
    };
  },

  getSystemHealth: async (): Promise<SystemHealth> => {
    await delay(300);
    const accessLevel = validateJWTToken();
    if (!hasPermission(accessLevel!, 'OPS')) {
      throw new Error('OPS or ROOT access level required for system health');
    }
    return {
      api_status: {
        status: "healthy",
        response_time_ms: 45,
        last_check: new Date().toISOString()
      },
      error_count_24h: 3,
      background_jobs: {
        pending: 5,
        running: 2,
        failed: 0
      }
    };
  },

  getAuditLogs: async (page: number, pageSize: number, userId?: string): Promise<{ logs: AuditLog[]; total: number }> => {
    await delay(400);
    validateJWTToken();
    let filtered = mockAuditLogs;
    if (userId) {
      filtered = mockAuditLogs.filter(l => l.user_id.includes(userId));
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      logs: filtered.slice(start, end),
      total: filtered.length
    };
  },

  getAccessLogs: async (page: number, pageSize: number, userId?: string): Promise<{ logs: AccessLog[]; total: number }> => {
    await delay(400);
    validateJWTToken();
    let filtered = mockAccessLogs;
    if (userId) {
      filtered = mockAccessLogs.filter(l => l.user_id.includes(userId));
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      logs: filtered.slice(start, end),
      total: filtered.length
    };
  },

  getComplianceLogs: async (page: number, pageSize: number, eventType?: string): Promise<{ logs: ComplianceLog[]; total: number }> => {
    await delay(400);
    validateJWTToken();
    let filtered = mockComplianceLogs;
    if (eventType) {
      filtered = mockComplianceLogs.filter(l => l.event_type.toLowerCase().includes(eventType.toLowerCase()));
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      logs: filtered.slice(start, end),
      total: filtered.length
    };
  }
};

/**
 * Phase 2 – Additional SuperAdmin-only APIs
 * These are kept as separate exports for clarity but conceptually share the same /api/v1/superadmin backend.
 */

// ---------- Feature Flags & Rollouts ----------

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number; // 0–100
  isBeta: boolean;
  updatedAt: string;
}

const mockFeatureFlags: FeatureFlag[] = [
  {
    id: 'feat-doubt-solver-v2',
    name: 'Doubt Solver v2',
    description: 'Next-gen AI doubt solving experience',
    enabled: true,
    rolloutPercentage: 60,
    isBeta: true,
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'feat-foundation-playlists',
    name: 'Foundation Playlists',
    description: 'Curated concept playlists for students',
    enabled: false,
    rolloutPercentage: 0,
    isBeta: false,
    updatedAt: '2024-01-10T08:30:00Z',
  },
  {
    id: 'feat-parent-insights',
    name: 'Parent Insights',
    description: 'High-level engagement insights for parents',
    enabled: true,
    rolloutPercentage: 100,
    isBeta: false,
    updatedAt: '2024-01-12T14:20:00Z',
  },
];

export const superAdminFeatureApi = {
  getFeatureFlags: async (): Promise<FeatureFlag[]> => {
    await delay(300);
    validateJWTToken();
    return mockFeatureFlags;
  },

  updateFeatureFlagStatus: async (id: string, enabled: boolean): Promise<void> => {
    await delay(200);
    validateJWTToken();
    const flag = mockFeatureFlags.find(f => f.id === id);
    if (flag) {
      flag.enabled = enabled;
      flag.updatedAt = new Date().toISOString();
    }
  },

  updateFeatureRollout: async (id: string, percentage: number): Promise<void> => {
    await delay(200);
    validateJWTToken();
    const flag = mockFeatureFlags.find(f => f.id === id);
    if (flag) {
      flag.rolloutPercentage = Math.max(0, Math.min(100, percentage));
      flag.updatedAt = new Date().toISOString();
    }
  },

  setFeatureBeta: async (id: string, isBeta: boolean): Promise<void> => {
    await delay(200);
    validateJWTToken();
    const flag = mockFeatureFlags.find(f => f.id === id);
    if (flag) {
      flag.isBeta = isBeta;
      flag.updatedAt = new Date().toISOString();
    }
  },
};

// ---------- Alerts & Thresholds ----------

export interface AlertConfig {
  dauThreshold: number;
  errorSpikeThreshold: number;
  aiUsageLimit: number;
  systemDowntimeEnabled: boolean;
  systemDowntimeMinutes: number;
  updatedAt: string;
  updatedBy: string;
}

let mockAlertConfig: AlertConfig = {
  dauThreshold: 5000,
  errorSpikeThreshold: 100,
  aiUsageLimit: 2000,
  systemDowntimeEnabled: true,
  systemDowntimeMinutes: 10,
  updatedAt: '2024-01-15T09:00:00Z',
  updatedBy: 'superadmin@eddge.com',
};

export const superAdminAlertsApi = {
  getAlertConfig: async (): Promise<AlertConfig> => {
    await delay(300);
    validateJWTToken();
    return mockAlertConfig;
  },

  updateAlertConfig: async (partial: Partial<AlertConfig>, actorEmail: string): Promise<AlertConfig> => {
    await delay(300);
    validateJWTToken();
    mockAlertConfig = {
      ...mockAlertConfig,
      ...partial,
      updatedAt: new Date().toISOString(),
      updatedBy: actorEmail,
    };
    return mockAlertConfig;
  },
};

// ---------- Admin Action Logging Helper ----------

export interface AdminActionLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  metadata?: string;
  timestamp: string;
}

const superAdminActionLogs: AdminActionLogEntry[] = [];

export const superAdminAuditApi = {
  logAdminAction: async (entry: Omit<AdminActionLogEntry, 'id' | 'timestamp'>): Promise<void> => {
    await delay(100);
    validateJWTToken();
    superAdminActionLogs.unshift({
      id: `sa-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    });
  },

  getAdminActions: async (page: number, pageSize: number, actor?: string, actionType?: string): Promise<{ logs: AdminActionLogEntry[]; total: number }> => {
    await delay(300);
    validateJWTToken();
    let filtered = superAdminActionLogs;
    if (actor) {
      filtered = filtered.filter(l => l.actor.toLowerCase().includes(actor.toLowerCase()));
    }
    if (actionType) {
      filtered = filtered.filter(l => l.action === actionType);
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      logs: filtered.slice(start, end),
      total: filtered.length,
    };
  },
};

// ---------- Usage ↔ Billing Correlation ----------

export interface UsageBillingSignal {
  schoolId: string;
  schoolName: string;
  planName: string;
  signalType: 'HIGH_USAGE_LOW_PLAN' | 'LOW_USAGE_HIGH_PLAN';
  message: string;
}

const mockUsageBillingSignals: UsageBillingSignal[] = [
  {
    schoolId: 'sch-001',
    schoolName: 'Delhi Public School',
    planName: 'Standard',
    signalType: 'HIGH_USAGE_LOW_PLAN',
    message: 'Usage in top 10% but on Standard plan – upgrade opportunity.',
  },
  {
    schoolId: 'sch-006',
    schoolName: 'Ryan International',
    planName: 'Premium',
    signalType: 'LOW_USAGE_HIGH_PLAN',
    message: 'Usage in bottom 30% on Premium plan – potential downgrade candidate.',
  },
];

export const superAdminUsageBillingApi = {
  getUsageBillingSignals: async (): Promise<UsageBillingSignal[]> => {
    await delay(300);
    validateJWTToken();
    return mockUsageBillingSignals;
  },
};

// ---------- Aggregated Data Export ----------

export interface UsageExportSummary {
  totalUsers: number;
  totalSchools: number;
  totalRequests: number;
}

export interface BillingExportSummary {
  totalRevenueMonthly: number;
  totalRevenueYearly: number;
  planBreakdown: Record<string, number>;
}

export interface SchoolRegistryExportSummary {
  totalSchools: number;
  byPlan: Record<string, number>;
  byState: Record<string, number>;
}

export const superAdminExportApi = {
  getUsageExportSummary: async (): Promise<UsageExportSummary> => {
    await delay(300);
    validateJWTToken();
    return {
      totalUsers: 45000,
      totalSchools: 150,
      totalRequests: 500000,
    };
  },

  getBillingExportSummary: async (): Promise<BillingExportSummary> => {
    await delay(300);
    validateJWTToken();
    return {
      totalRevenueMonthly: 150 * 199, // mock
      totalRevenueYearly: 150 * 1990,
      planBreakdown: {
        Basic: 40,
        Standard: 70,
        Premium: 40,
      },
    };
  },

  getSchoolRegistryExportSummary: async (): Promise<SchoolRegistryExportSummary> => {
    await delay(300);
    validateJWTToken();
    return {
      totalSchools: mockSchools.length,
      byPlan: mockSchools.reduce<Record<string, number>>((acc, s) => {
        acc[s.subscription_status] = (acc[s.subscription_status] || 0) + 1;
        return acc;
      }, {}),
      byState: {
        TRIAL: 5,
        PILOT: 10,
        ACTIVE: 120,
        SUSPENDED: 5,
        CHURNED: 10,
      },
    };
  },
};

// ---------- AI Cost Guardrails ----------

export interface SchoolAICap {
  schoolId: string;
  schoolName: string;
  monthlyCapUsd: number;
  warningThresholdUsd: number;
}

export interface FeatureAICap {
  featureId: string;
  featureName: string;
  monthlyCapUsd: number;
}

export interface AICostGuardrails {
  perSchoolCaps: SchoolAICap[];
  perFeatureCaps: FeatureAICap[];
  globalWarningLow: number;
  globalWarningHigh: number;
}

let mockAICostGuardrails: AICostGuardrails = {
  perSchoolCaps: [
    { schoolId: 'sch-001', schoolName: 'Delhi Public School', monthlyCapUsd: 300, warningThresholdUsd: 250 },
    { schoolId: 'sch-006', schoolName: 'Ryan International', monthlyCapUsd: 500, warningThresholdUsd: 450 },
  ],
  perFeatureCaps: [
    { featureId: 'doubt_solver', featureName: 'Doubt Solver', monthlyCapUsd: 1500 },
    { featureId: 'foundation_engine', featureName: 'Foundation Engine', monthlyCapUsd: 800 },
    { featureId: 'assessments', featureName: 'Assessments', monthlyCapUsd: 600 },
  ],
  globalWarningLow: 2000,
  globalWarningHigh: 5000,
};

export const superAdminAICostsApi = {
  getAICostGuardrails: async (): Promise<AICostGuardrails> => {
    await delay(300);
    validateJWTToken();
    return mockAICostGuardrails;
  },

  updateAICostGuardrails: async (updated: Partial<AICostGuardrails>): Promise<AICostGuardrails> => {
    await delay(300);
    validateJWTToken();
    mockAICostGuardrails = {
      ...mockAICostGuardrails,
      ...updated,
    };
    return mockAICostGuardrails;
  },
};

// ---------- Admins & Roles ----------

export type AdminRole = 'ROOT' | 'OPS' | 'FINANCE';

export interface InternalAdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at: string;
}

const mockAdmins: InternalAdminUser[] = [
  {
    id: 'adm-001',
    email: 'root@eddge.com',
    name: 'Root SuperAdmin',
    role: 'ROOT',
    is_active: true,
    last_login_at: '2024-01-20T09:15:00Z',
  },
  {
    id: 'adm-002',
    email: 'ops@eddge.com',
    name: 'Ops Admin',
    role: 'OPS',
    is_active: true,
    last_login_at: '2024-01-19T14:05:00Z',
  },
  {
    id: 'adm-003',
    email: 'finance@eddge.com',
    name: 'Finance Admin',
    role: 'FINANCE',
    is_active: true,
    last_login_at: '2024-01-18T11:30:00Z',
  },
];

export const superAdminAdminsApi = {
  getAdmins: async (): Promise<InternalAdminUser[]> => {
    await delay(300);
    validateJWTToken();
    return mockAdmins;
  },

  createAdmin: async (admin: { email: string; name: string; role: AdminRole }): Promise<InternalAdminUser> => {
    await delay(500);
    const accessLevel = validateJWTToken();
    if (!hasPermission(accessLevel!, 'ROOT')) {
      throw new Error('Only ROOT can create new internal admins');
    }
    const newAdmin: InternalAdminUser = {
      id: `adm-${Date.now()}`,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      is_active: true,
      last_login_at: '—',
    };
    mockAdmins.push(newAdmin);
    return newAdmin;
  },

  updateAdminRole: async (adminId: string, role: AdminRole, actorEmail: string): Promise<void> => {
    await delay(400);
    const accessLevel = validateJWTToken();
    if (!hasPermission(accessLevel!, 'ROOT')) {
      throw new Error('Only ROOT can update admin roles');
    }
    const admin = mockAdmins.find(a => a.id === adminId);
    if (!admin) throw new Error('Admin not found');
    if (admin.email === actorEmail) {
      throw new Error('You cannot change your own role');
    }
    admin.role = role;
  },

  disableAdmin: async (adminId: string, actorEmail: string): Promise<void> => {
    await delay(400);
    const accessLevel = validateJWTToken();
    if (!hasPermission(accessLevel!, 'ROOT')) {
      throw new Error('Only ROOT can disable admins');
    }
    const admin = mockAdmins.find(a => a.id === adminId);
    if (!admin) throw new Error('Admin not found');
    if (admin.email === actorEmail) {
      throw new Error('You cannot disable your own account');
    }
    admin.is_active = false;
  },
};

// ---------- Platform Settings ----------

export interface PlatformSettings {
  maintenanceMode: boolean;
  defaultLanguage: string;
  globalFeatureDefaults: {
    doubtSolverEnabled: boolean;
    foundationEngineEnabled: boolean;
  };
  platformUsageLimitMonthlyRequests: number;
  updatedAt: string;
  updatedBy: string;
}

let mockPlatformSettings: PlatformSettings = {
  maintenanceMode: false,
  defaultLanguage: 'en',
  globalFeatureDefaults: {
    doubtSolverEnabled: true,
    foundationEngineEnabled: true,
  },
  platformUsageLimitMonthlyRequests: 1000000,
  updatedAt: '2024-01-15T10:00:00Z',
  updatedBy: 'root@eddge.com',
};

export const superAdminSettingsApi = {
  getSettings: async (): Promise<PlatformSettings> => {
    await delay(300);
    validateJWTToken();
    return mockPlatformSettings;
  },

  updateSettings: async (partial: Partial<PlatformSettings>, actorEmail: string): Promise<PlatformSettings> => {
    await delay(400);
    validateJWTToken();
    mockPlatformSettings = {
      ...mockPlatformSettings,
      ...partial,
      updatedAt: new Date().toISOString(),
      updatedBy: actorEmail,
    };
    return mockPlatformSettings;
  },
};

// ---------- Incidents ----------

export interface Incident {
  id: string;
  title: string;
  status: 'open' | 'closed';
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  closed_at?: string;
  summary: string;
  resolution_notes?: string;
}

const mockIncidents: Incident[] = [
  {
    id: 'inc-001',
    title: 'Intermittent API latency',
    status: 'open',
    severity: 'medium',
    created_at: '2024-01-18T09:00:00Z',
    summary: 'Spike in API response times observed in India region.',
  },
  {
    id: 'inc-002',
    title: 'Billing webhook failures',
    status: 'closed',
    severity: 'high',
    created_at: '2024-01-10T11:30:00Z',
    closed_at: '2024-01-10T15:00:00Z',
    summary: 'Third-party billing webhook timeouts.',
    resolution_notes: 'Increased timeout and added retries; monitoring in place.',
  },
];

export const superAdminIncidentsApi = {
  getIncidents: async (): Promise<Incident[]> => {
    await delay(300);
    validateJWTToken();
    return mockIncidents;
  },

  logIncident: async (payload: { title: string; severity: Incident['severity']; summary: string }): Promise<Incident> => {
    await delay(400);
    validateJWTToken();
    const incident: Incident = {
      id: `inc-${Date.now()}`,
      title: payload.title,
      severity: payload.severity,
      status: 'open',
      created_at: new Date().toISOString(),
      summary: payload.summary,
    };
    mockIncidents.unshift(incident);
    return incident;
  },

  addResolutionNotes: async (incidentId: string, notes: string): Promise<void> => {
    await delay(300);
    validateJWTToken();
    const incident = mockIncidents.find(i => i.id === incidentId);
    if (!incident) throw new Error('Incident not found');
    if (incident.status === 'closed') return; // immutable after closure
    incident.resolution_notes = notes;
  },

  closeIncident: async (incidentId: string): Promise<void> => {
    await delay(300);
    validateJWTToken();
    const incident = mockIncidents.find(i => i.id === incidentId);
    if (!incident) throw new Error('Incident not found');
    if (incident.status === 'closed') return;
    incident.status = 'closed';
    incident.closed_at = new Date().toISOString();
  },
};

// ---------- Adoption & Onboarding (Read-only) ----------

export interface AdoptionSummary {
  totalSchools: number;
  onboardingComplete: number;
  onboardingInProgress: number;
  lowUsageSchools: number;
  featureAdoption: {
    doubtSolver: number;
    foundationEngine: number;
    assessments: number;
  };
}

export const superAdminAdoptionApi = {
  getAdoptionSummary: async (): Promise<AdoptionSummary> => {
    await delay(400);
    validateJWTToken();
    return {
      totalSchools: mockSchools.length,
      onboardingComplete: 9,
      onboardingInProgress: 2,
      lowUsageSchools: 3,
      featureAdoption: {
        doubtSolver: 80,
        foundationEngine: 65,
        assessments: 72,
      },
    };
  },
};

// ---------- Support & Escalations ----------

export interface SupportEscalation {
  id: string;
  schoolName: string;
  subject: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved';
  linkedIncidentId?: string;
  created_at: string;
  resolved_at?: string;
}

const mockEscalations: SupportEscalation[] = [
  {
    id: 'esc-001',
    schoolName: 'Delhi Public School',
    subject: 'Sync issues with student roster',
    severity: 'medium',
    status: 'open',
    created_at: '2024-01-17T08:15:00Z',
  },
  {
    id: 'esc-002',
    schoolName: 'Ryan International',
    subject: 'Assessment results delay',
    severity: 'low',
    status: 'resolved',
    created_at: '2024-01-12T10:45:00Z',
    resolved_at: '2024-01-12T13:00:00Z',
  },
];

export const superAdminSupportApi = {
  getEscalations: async (): Promise<SupportEscalation[]> => {
    await delay(300);
    validateJWTToken();
    return mockEscalations;
  },

  tagSeverity: async (id: string, severity: SupportEscalation['severity']): Promise<void> => {
    await delay(200);
    validateJWTToken();
    const esc = mockEscalations.find(e => e.id === id);
    if (!esc) throw new Error('Escalation not found');
    esc.severity = severity;
  },

  linkIncident: async (id: string, incidentId: string): Promise<void> => {
    await delay(200);
    validateJWTToken();
    const esc = mockEscalations.find(e => e.id === id);
    if (!esc) throw new Error('Escalation not found');
    esc.linkedIncidentId = incidentId;
  },

  markResolved: async (id: string): Promise<void> => {
    await delay(200);
    validateJWTToken();
    const esc = mockEscalations.find(e => e.id === id);
    if (!esc) throw new Error('Escalation not found');
    esc.status = 'resolved';
    esc.resolved_at = new Date().toISOString();
  },
};

