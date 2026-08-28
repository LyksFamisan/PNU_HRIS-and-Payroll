export type AppScreen = "home" | "portal" | "login" | "app";
export type Role = "admin" | "hr" | "payroll" | "recruitment" | "training" | "performance" | "management" | "employee" | "faculty";

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  role: Role;
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  lastLogin: string;
  isActive: boolean;
}
export type Page = "dashboard" | "employees" | "employee-detail" | "payroll" | "payslip" | "leave" | "attendance" | "reports" | "notifications" | "settings" | "audit" | "profile" | "recruitment" | "training" | "performance" | "rewards" | "wellness" | "faculty";

export interface Employee {
  id: string; employeeNo: string; fullName: string;
  lastName: string; firstName: string; middleName: string;
  position: string; rank: string; department: string;
  employmentType: "Permanent" | "Contractual" | "COS" | "Part-time";
  salaryGrade: number; step: number; monthlySalary: number;
  status: "Active" | "Inactive" | "On Leave" | "Suspended" | "Retired";
  gender: "Male" | "Female"; birthDate: string; email: string;
  phone: string; dateHired: string; tin: string; gsis: string;
  philhealth: string; pagibig: string; vacationLeave: number;
  sickLeave: number; color: string;
}

export interface DtrRecord {
  employeeId: string; date: string;
  timeIn: string | null; timeOut: string | null;
  status: "Present" | "Absent" | "Late" | "On Leave" | "Holiday";
  overtime: number;
}

export interface LeaveRequest {
  id: string; employeeId: string; employeeName: string; department: string;
  leaveType: string; startDate: string; endDate: string; days: number;
  reason: string; status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  appliedDate: string; approvedBy?: string; remarks?: string;
}

export interface PayrollRun {
  id: string; period: string; cutOff: string; payDate: string;
  employees: number; grossPay: number; totalDeductions: number;
  netPay: number; status: "Draft" | "For Approval" | "Approved" | "Released";
  createdBy: string;
}

export interface NotifItem {
  id: string; type: "info" | "success" | "warning" | "error";
  title: string; message: string; time: string; read: boolean;
}

export interface PhotoAttendanceRecord {
  id: string; employeeId: string; employeeName: string; employeeNo: string;
  date: string; time: string; type: "TimeIn" | "TimeOut"; photo: string | null;
  lat: number | null; lng: number | null; accuracy: number | null; address: string;
  distanceFromAuth: number; withinGeofence: boolean;
  status: "Present" | "Late" | "Outside Location";
}

export interface AIMessage { id: string; role: "user" | "bot"; text: string; time: string; }

export interface JobVacancy {
  id: string; position: string; department: string; salaryGrade: number;
  employmentType: string; slots: number; deadline: string; status: "Open" | "Closed" | "For Approval";
  applicants: number; qualifications: string;
}
export interface Applicant {
  id: string; vacancyId: string; name: string; email: string;
  appliedDate: string; status: "Pending" | "Shortlisted" | "Examination" | "Interview" | "Passed" | "Failed" | "Hired";
  score: number | null; type: "Internal" | "External";
}
export interface TrainingProgram {
  id: string; title: string; organizer: string; venue: string;
  startDate: string; endDate: string; type: "Mandatory" | "Optional" | "Scholarship";
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  slots: number; nominated: number; category: string;
}
export interface TrainingNomination {
  id: string; programId: string; employeeId: string; employeeName: string;
  department: string; status: "Pending" | "Approved" | "Completed" | "Declined";
  nominatedDate: string;
}
export interface PerformanceRating {
  id: string; employeeId: string; employeeName: string; department: string;
  period: string; type: "IPCR" | "OPCR";
  outputScore: number; efficiencyScore: number; timelinessScore: number;
  finalRating: number; adjectivalRating: string;
  status: "Draft" | "Submitted" | "Reviewed" | "Approved";
  submittedDate: string;
}
export interface RewardNomination {
  id: string; awardType: string; nomineeId: string; nomineeName: string;
  department: string; nominatedBy: string; reason: string;
  status: "Pending" | "Endorsed" | "Approved" | "Rejected";
  period: string; dateNominated: string;
}
export interface WellnessRecord {
  id: string; employeeId: string; employeeName: string;
  type: "Medical" | "Dental" | "Mental Health" | "Wellness Program";
  description: string; date: string; provider: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}
export interface FacultyProfile {
  employeeId: string; specialization: string; highestDegree: string;
  university: string; teachingLoad: number; researchCount: number;
  extensionCount: number; publications: number; awards: number;
  licenseNo: string; licenseExpiry: string;
  rank: "Instructor" | "Assistant Professor" | "Associate Professor" | "Professor" | "University Professor";
  evaluation: number;
}
