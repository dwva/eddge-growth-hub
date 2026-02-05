import type { AdminState, Student, Teacher, Class, AttendanceRecord } from '@/types/admin';
import { format, subDays } from 'date-fns';

const STORAGE_KEY = 'eddge_admin_state_v1';

// Generate seed/demo data for the admin dashboard
function generateSeedData(): AdminState {
  // Generate Teachers (48 teachers as shown in the badge)
  const teacherNames = [
    'Dr. Sarah Johnson', 'Mr. Rajesh Kumar', 'Ms. Priya Sharma', 'Mr. David Wilson', 'Ms. Anita Patel',
    'Mr. Suresh Verma', 'Dr. Meera Singh', 'Mr. Anil Desai', 'Ms. Kavita Reddy', 'Mr. Ramesh Iyer',
    'Dr. Neha Gupta', 'Mr. Vikram Malhotra', 'Ms. Sunita Nair', 'Mr. Pradeep Joshi', 'Ms. Deepa Menon',
    'Mr. Karan Kapoor', 'Dr. Swati Rao', 'Mr. Manoj Tiwari', 'Ms. Radha Krishnan', 'Mr. Naveen Agarwal',
    'Ms. Shalini Bhatia', 'Mr. Rohit Mehta', 'Dr. Anjali Chaturvedi', 'Mr. Sameer Khan', 'Ms. Pooja Shah',
    'Mr. Aditya Verma', 'Ms. Ritu Agarwal', 'Mr. Gaurav Singh', 'Dr. Preeti Nanda', 'Ms. Jyoti Malhotra',
    'Mr. Harsh Patel', 'Ms. Sneha Reddy', 'Mr. Arjun Iyer', 'Dr. Divya Sharma', 'Ms. Tanvi Desai',
    'Mr. Rahul Joshi', 'Ms. Ishita Menon', 'Mr. Varun Kapoor', 'Dr. Kritika Rao', 'Ms. Ananya Tiwari',
    'Mr. Akash Krishnan', 'Ms. Nisha Agarwal', 'Mr. Yash Bhatia', 'Dr. Aarti Mehta', 'Ms. Riya Chaturvedi',
    'Mr. Dev Khan', 'Ms. Zara Shah', 'Mr. Karan Verma'
  ];

  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'Physical Education', 'Art', 'Music', 'Economics', 'Political Science', 'Hindi'
  ];

  const teachers: Teacher[] = teacherNames.map((name, idx) => {
    const teacherSubjects: string[] = [];
    // Each teacher teaches 1-3 subjects
    const numSubjects = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numSubjects; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      if (!teacherSubjects.includes(subject)) {
        teacherSubjects.push(subject);
      }
    }
    if (teacherSubjects.length === 0) teacherSubjects.push(subjects[0]);

    // Generate join date (between 2020 and 2024)
    const joinYear = 2020 + Math.floor(Math.random() * 5);
    const joinMonth = Math.floor(Math.random() * 12) + 1;
    const joinDay = Math.floor(Math.random() * 28) + 1;
    const joinDate = `${joinYear}-${String(joinMonth).padStart(2, '0')}-${String(joinDay).padStart(2, '0')}`;

    // Generate unique email
    const emailBase = name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '.').replace(/^dr\.|^mr\.|^ms\./g, '');
    const email = `${emailBase}${idx > 0 ? idx : ''}@school.edu`;

    return {
      id: `teacher-${idx + 1}`,
      name,
      email,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      subjects: teacherSubjects,
      status: idx < 42 ? 'Active' : 'OnLeave', // 42 active, 6 on leave
      joinDate,
    };
  });

  // Generate Classes (42 classes across grades 9-12)
  const classes: Class[] = [];
  const grades = ['9', '10', '11', '12'];
  const sections = ['A', 'B', 'C'];
  
  grades.forEach(grade => {
    sections.forEach(section => {
      // Assign a random teacher as class teacher
      const classTeacher = teachers[Math.floor(Math.random() * teachers.length)];
      classes.push({
        id: `class-${grade}-${section}`,
        grade,
        section,
        classTeacherId: classTeacher.id,
      });
    });
  });

  // Add a few more classes for variety
  ['9', '10'].forEach(grade => {
    classes.push({
      id: `class-${grade}-D`,
      grade,
      section: 'D',
      classTeacherId: teachers[Math.floor(Math.random() * teachers.length)].id,
    });
  });

  // Generate Students (around 1250 students distributed across classes)
  const studentFirstNames = [
    'Alex', 'Emma', 'Rahul', 'Priya', 'David', 'Sarah', 'Arjun', 'Ananya', 'Rohan', 'Kavya',
    'Vikram', 'Isha', 'Aditya', 'Meera', 'Karan', 'Sneha', 'Rohit', 'Pooja', 'Aryan', 'Divya',
    'Harsh', 'Tanvi', 'Varun', 'Riya', 'Akash', 'Nisha', 'Dev', 'Zara', 'Yash', 'Ishita',
    'Sameer', 'Anjali', 'Gaurav', 'Shalini', 'Manoj', 'Radha', 'Naveen', 'Deepa', 'Pradeep', 'Sunita',
    'Anil', 'Kavita', 'Suresh', 'Neha', 'Rajesh', 'Swati', 'Karan', 'Preeti', 'Harsh', 'Jyoti'
  ];

  const studentLastNames = [
    'Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Iyer', 'Gupta', 'Malhotra', 'Nair', 'Joshi',
    'Menon', 'Kapoor', 'Rao', 'Tiwari', 'Krishnan', 'Agarwal', 'Bhatia', 'Mehta', 'Chaturvedi', 'Khan',
    'Shah', 'Verma', 'Desai', 'Nanda', 'Johnson', 'Wilson', 'Brown', 'Davis', 'Miller', 'Anderson'
  ];

  const students: Student[] = [];
  let rollNumber = 1;
  const usedEmails = new Set<string>();

  classes.forEach(cls => {
    // Each class has 25-35 students
    const classSize = Math.floor(Math.random() * 11) + 25;
    let classRollNumber = 1;
    
    for (let i = 0; i < classSize; i++) {
      const firstName = studentFirstNames[Math.floor(Math.random() * studentFirstNames.length)];
      const lastName = studentLastNames[Math.floor(Math.random() * studentLastNames.length)];
      const name = `${firstName} ${lastName}`;
      
      // Ensure unique email
      let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`;
      let emailCounter = 1;
      while (usedEmails.has(email)) {
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emailCounter}@school.edu`;
        emailCounter++;
      }
      usedEmails.add(email);
      
      // Generate attendance (70-100%)
      const attendancePercentage = Math.floor(Math.random() * 31) + 70;
      // Generate performance (60-95%)
      const performanceScore = Math.floor(Math.random() * 36) + 60;
      
      // Determine status based on attendance and performance
      const status: 'Active' | 'AtRisk' = (attendancePercentage < 80 || performanceScore < 70) ? 'AtRisk' : 'Active';
      
      const parentName = `Mr./Ms. ${lastName}`;
      
      students.push({
        id: `student-${cls.id}-${i + 1}`,
        name,
        email,
        rollNumber: classRollNumber++,
        classId: cls.id,
        attendancePercentage,
        performanceScore,
        parentContact: parentName,
        status,
      });
    }
  });

  // Generate Attendance Records for the last 30 days
  const attendanceRecords: AttendanceRecord[] = [];
  const today = new Date();
  
  classes.forEach(cls => {
    const studentsInClass = students.filter(s => s.classId === cls.id);
    const classSize = studentsInClass.length;
    
    for (let day = 0; day < 30; day++) {
      const date = subDays(today, day);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Generate attendance counts (some variation day to day)
      const basePresent = Math.floor(classSize * 0.85); // ~85% base attendance
      const presentCount = Math.max(0, Math.min(classSize, basePresent + Math.floor(Math.random() * 10) - 5));
      const absentCount = Math.max(0, classSize - presentCount - Math.floor(Math.random() * 3));
      const lateCount = classSize - presentCount - absentCount;
      
      attendanceRecords.push({
        id: `attendance-${cls.id}-${dateStr}`,
        date: dateStr,
        classId: cls.id,
        presentCount,
        absentCount,
        lateCount,
      });
    }
  });

  return {
    students,
    teachers,
    classes,
    attendanceRecords,
    riskAlerts: [], // Will be computed automatically by the context
    version: 1,
  };
}

const seedData = generateSeedData();

const defaultState: AdminState = {
  students: [],
  teachers: [],
  classes: [],
  attendanceRecords: [],
  riskAlerts: [],
  version: 1,
};

export function loadInitialAdminState(): AdminState {
  if (typeof window === 'undefined') return seedData;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // If no data exists, return seed data and save it
      const dataToReturn = seedData;
      // Save immediately
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToReturn));
      return dataToReturn;
    }
    const parsed = JSON.parse(raw) as AdminState;
    if (!parsed || typeof parsed !== 'object') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
    if (typeof parsed.version !== 'number') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
    
    // Check if the data is essentially empty (all arrays are empty)
    const isEmpty = isStateEmpty(parsed);
    
    if (isEmpty) {
      // If data is empty, return seed data and save it
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
    
    // If we have valid saved data with content, use it
    return parsed;
  } catch {
    // On error, return seed data and save it
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    }
    return seedData;
  }
}

// Helper function to reset to seed data (useful for development/testing)
export function resetToSeedData(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    // Reload the page to apply changes
    window.location.reload();
  } catch {
    // Ignore errors
  }
}

// Expose reset function to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).resetAdminData = resetToSeedData;
}

// Helper function to check if current state is empty
export function isStateEmpty(state: AdminState): boolean {
  return (
    (!state.students || state.students.length === 0) &&
    (!state.teachers || state.teachers.length === 0) &&
    (!state.classes || state.classes.length === 0)
  );
}

export function saveAdminState(state: AdminState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Best-effort persistence; ignore quota or serialization errors
  }
}


