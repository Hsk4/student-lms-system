export type EnrollmentStatus = "active" | "awaiting_teacher" | "none";

export type SessionType = "class" | "one-on-one";

export interface ParentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  relationship: "mother" | "father" | "guardian";
}

export interface ChildTeacher {
  id: string;
  name: string;
  subject: string;
  sessionType: SessionType;
  schedule: string;
}

export interface ChildSubject {
  id: string;
  subject: string;
  teacherId: string;
  teacherName: string;
}

export interface LinkedChild {
  id: string;
  name: string;
  email: string;
  board: string;
  level: string;
  relationship: string;
  linkDate: string;
  status: EnrollmentStatus;
  subjects: ChildSubject[];
  teachers: ChildTeacher[];
  attendancePercent: number;
  averageGradePercent: number;
  assignmentsDueThisWeek: number;
}

export type GradeStatus = "graded";

export interface GradeItem {
  id: string;
  childId: string;
  subject: string;
  teacherName: string;
  title: string;
  type: string;
  score: number;
  max: number;
  date: string;
  comment?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused" | "upcoming";

export interface AttendanceDay {
  date: string;
  status: AttendanceStatus;
  subject?: string;
  reason?: string;
}

export interface ChildAttendanceSummary {
  childId: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export type AssignmentStatus = "due" | "submitted" | "missing" | "graded";

export interface ChildAssignment {
  id: string;
  childId: string;
  title: string;
  subject: string;
  dueDate: string;
  status: AssignmentStatus;
  score?: number;
  max?: number;
  feedback?: string;
  feedbackDate?: string;
}

export type InvoiceStatus = "due" | "paid" | "overdue";

export interface InvoiceLineItem {
  label: string;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  childId: string;
  childName: string;
  period: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  paidOn?: string;
  lineItems: InvoiceLineItem[];
}

export type MeetingStatus = "pending" | "confirmed" | "rescheduled" | "declined";

export interface MeetingRequest {
  id: string;
  childId: string;
  childName: string;
  teacherName: string;
  topic: string;
  notes?: string;
  requestedFor: string;
  status: MeetingStatus;
  proposedTime?: string;
}

export interface UpcomingMeeting {
  id: string;
  childId: string;
  childName: string;
  teacherName: string;
  topic: string;
  scheduledAt: string;
  location: string;
  joinLink: string;
}

export interface PastMeeting {
  id: string;
  childId: string;
  childName: string;
  teacherName: string;
  topic: string;
  heldAt: string;
  notes?: string;
}

export interface TeacherFeedback {
  id: string;
  childId: string;
  teacherName: string;
  subject: string;
  date: string;
  excerpt: string;
}

export type CalendarEventType = "assignment" | "session" | "meeting" | "invoice";

export interface UpcomingEvent {
  id: string;
  type: CalendarEventType;
  title: string;
  childId: string;
  someTime: string;
  date: string;
}

export type AlertSeverity = "critical" | "warning" | "info";

export interface HomeAlert {
  id: string;
  severity: AlertSeverity;
  message: string;
  childId: string;
  href: string;
}

export type NotificationKind = "grade" | "attendance" | "invoice" | "meeting";

export interface ParentNotification {
  id: string;
  kind: NotificationKind;
  text: string;
  childId?: string;
  childName?: string;
  occurredAt: string;
  read: boolean;
  href: string;
}
