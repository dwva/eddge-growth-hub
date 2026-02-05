import { createContext, useContext, useEffect, useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';
import { loadInitialAdminState, saveAdminState } from '@/lib/localStorageAdminStore';
import type { AdminAction, AdminState, RiskAlert } from '@/types/admin';

interface AdminDataContextValue {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
}

const AdminDataContext = createContext<AdminDataContextValue | undefined>(undefined);

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter((s) => s.id !== action.payload.id),
      };
    case 'ADD_TEACHER':
      return { ...state, teachers: [...state.teachers, action.payload] };
    case 'UPDATE_TEACHER':
      return {
        ...state,
        teachers: state.teachers.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TEACHER':
      return {
        ...state,
        teachers: state.teachers.filter((t) => t.id !== action.payload.id),
      };
    case 'ADD_CLASS':
      return { ...state, classes: [...state.classes, action.payload] };
    case 'UPDATE_CLASS':
      return {
        ...state,
        classes: state.classes.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'DELETE_CLASS':
      return {
        ...state,
        classes: state.classes.filter((c) => c.id !== action.payload.id),
      };
    case 'UPSERT_ATTENDANCE_RECORD': {
      const exists = state.attendanceRecords.some((r) => r.id === action.payload.id);
      return exists
        ? {
            ...state,
            attendanceRecords: state.attendanceRecords.map((r) =>
              r.id === action.payload.id ? action.payload : r,
            ),
          }
        : { ...state, attendanceRecords: [...state.attendanceRecords, action.payload] };
    }
    case 'DELETE_ATTENDANCE_RECORD':
      return {
        ...state,
        attendanceRecords: state.attendanceRecords.filter((r) => r.id !== action.payload.id),
      };
    case 'SET_RISK_ALERTS':
      return { ...state, riskAlerts: action.payload };
    case 'RESOLVE_RISK_ALERT':
      return {
        ...state,
        riskAlerts: state.riskAlerts.map((alert) =>
          alert.id === action.payload.id ? { ...alert, resolvedAt: new Date().toISOString() } : alert,
        ),
      };
    case 'HYDRATE_STATE':
      return action.payload;
    default:
      return state;
  }
}

// Risk detection logic
function computeRiskAlerts(state: AdminState): RiskAlert[] {
  const alerts: RiskAlert[] = [];

  // Check each student for risks
  state.students.forEach(student => {
    if (student.attendancePercentage < 80) {
      alerts.push({
        id: `risk-${student.id}-attendance`,
        type: 'LowAttendance',
        entityType: 'student',
        entityId: student.id,
        reason: `Attendance is ${student.attendancePercentage}% (below 80% threshold)`,
        severity: student.attendancePercentage < 70 ? 'high' : student.attendancePercentage < 75 ? 'medium' : 'low',
        createdAt: new Date().toISOString(),
      });
    }
    if (student.performanceScore < 70) {
      alerts.push({
        id: `risk-${student.id}-performance`,
        type: 'LowPerformance',
        entityType: 'student',
        entityId: student.id,
        reason: `Performance score is ${student.performanceScore}% (below 70% threshold)`,
        severity: student.performanceScore < 60 ? 'high' : 'medium',
        createdAt: new Date().toISOString(),
      });
    }
  });

  // Check each class for risks (if many students are at risk)
  state.classes.forEach(cls => {
    const studentsInClass = state.students.filter(s => s.classId === cls.id);
    if (studentsInClass.length === 0) return;

    const atRiskCount = studentsInClass.filter(s => 
      s.attendancePercentage < 80 || s.performanceScore < 70
    ).length;
    const atRiskPercentage = (atRiskCount / studentsInClass.length) * 100;

    if (atRiskPercentage > 30) {
      alerts.push({
        id: `risk-${cls.id}-class`,
        type: 'LowAttendance',
        entityType: 'class',
        entityId: cls.id,
        reason: `${atRiskCount} out of ${studentsInClass.length} students (${Math.round(atRiskPercentage)}%) are at risk`,
        severity: atRiskPercentage > 50 ? 'high' : 'medium',
        createdAt: new Date().toISOString(),
      });
    }
  });

  return alerts;
}

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(adminReducer, undefined as unknown as AdminState, () => {
    const loaded = loadInitialAdminState();
    // Ensure seed data is saved if it was just loaded
    if (loaded.students.length > 100 && loaded.teachers.length > 10 && loaded.classes.length > 10) {
      // This is seed data, make sure it's saved
      saveAdminState(loaded);
    }
    return loaded;
  });

  // Compute risk alerts whenever state changes
  const computedRiskAlerts = useMemo(() => {
    return computeRiskAlerts(state);
  }, [state.students, state.classes]);

  // Update risk alerts if they've changed
  useEffect(() => {
    const existingAlertIds = new Set(state.riskAlerts.map(a => a.id));
    const newAlertIds = new Set(computedRiskAlerts.map(a => a.id));
    
    // Only update if there are actual changes
    if (existingAlertIds.size !== newAlertIds.size || 
        !Array.from(existingAlertIds).every(id => newAlertIds.has(id))) {
      dispatch({ type: 'SET_RISK_ALERTS', payload: computedRiskAlerts });
    }
  }, [computedRiskAlerts, state.riskAlerts]);

  useEffect(() => {
    saveAdminState(state);
  }, [state]);

  return (
    <AdminDataContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return ctx;
};


