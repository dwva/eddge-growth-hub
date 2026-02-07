export type StudentStatus = 'Active' | 'AtRisk';

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: number;
  classId: string | null;
  attendancePercentage: number;
  performanceScore: number;
  parentContact: string;
  status: StudentStatus;
}

export type TeacherStatus = 'Active' | 'OnLeave';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  status: TeacherStatus;
  joinDate: string; // ISO date string
}

export interface Class {
  id: string;
  grade: string;
  section: string;
  classTeacherId: string | null;
}

export interface AttendanceRecord {
  id: string;
  date: string; // ISO date
  classId: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
}

export type RiskEntityType = 'student' | 'class';

export interface RiskAlert {
  id: string;
  type: 'LowAttendance' | 'LowPerformance';
  entityType: RiskEntityType;
  entityId: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
}

export interface Topic {
  id: string;
  name: string;
  weightage?: number;
}

export interface Chapter {
  id: string;
  name: string;
  order: number;
  topics: Topic[];
}

export type SyllabusBoard = 'CBSE' | 'ICSE' | 'STATE';
export type SyllabusStatus = 'draft' | 'published';

export interface Syllabus {
  id: string;
  board: SyllabusBoard;
  academicYear: string;
  class: string;
  subject: string;
  chapters: Chapter[];
  status: SyllabusStatus;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface AdminState {
  students: Student[];
  teachers: Teacher[];
  classes: Class[];
  attendanceRecords: AttendanceRecord[];
  riskAlerts: RiskAlert[];
  syllabi: Syllabus[];
  version: number;
}

export type AdminAction =
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: { id: string } }
  | { type: 'ADD_TEACHER'; payload: Teacher }
  | { type: 'UPDATE_TEACHER'; payload: Teacher }
  | { type: 'DELETE_TEACHER'; payload: { id: string } }
  | { type: 'ADD_CLASS'; payload: Class }
  | { type: 'UPDATE_CLASS'; payload: Class }
  | { type: 'DELETE_CLASS'; payload: { id: string } }
  | { type: 'UPSERT_ATTENDANCE_RECORD'; payload: AttendanceRecord }
  | { type: 'DELETE_ATTENDANCE_RECORD'; payload: { id: string } }
  | { type: 'SET_RISK_ALERTS'; payload: RiskAlert[] }
  | { type: 'RESOLVE_RISK_ALERT'; payload: { id: string } }
  | { type: 'ADD_SYLLABUS'; payload: Syllabus }
  | { type: 'UPDATE_SYLLABUS'; payload: Syllabus }
  | { type: 'DELETE_SYLLABUS'; payload: { id: string } }
  | { type: 'PUBLISH_SYLLABUS'; payload: { id: string } }
  | { type: 'HYDRATE_STATE'; payload: AdminState };


