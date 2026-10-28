export type SessionType = "class" | "one-on-one";

export type StudentStatus = "active" | "completed";

export type RequestStatus = "pending" | "accepted" | "declined";

export type ClassStatus = "current" | "previous";

export type AssignmentStatus = "draft" | "published" | "closed";

export type SubmissionStatus =
  | "submitted"
  | "late"
  | "missing"
  | "graded"
  | "resubmission";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type TicketStatus = "open" | "resolved";

export type MeetingRequestStatus = "pending" | "confirmed" | "declined";

export type MaterialKind = "pdf" | "worksheet" | "slides" | "video" | "link";

export type ScheduleEventKind = "class" | "one-on-one" | "meeting";

export type TeacherNotificationKind = "request" | "submission" | "meeting" | "support";

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  role: "Teacher";
  subject: string;
  boards: string[];
  levels: string[];
}

export interface ParentContact {
  name: string;
  email: string;
}

export interface TeacherStudent {
  id: string;
  name: string;
  board: string;
  level: string;
  subject: string;
  sessionType: SessionType;
  classId: string | null;
  status: StudentStatus;
  attendancePercent: number;
  averageGradePercent: number;
  onTimeSubmissionPercent: number;
  lastActivityAt: string;
  parent: ParentContact;
}

export interface TeacherClass {
  id: string;
  name: string;
  subject: string;
  level: string;
  board: string;
  capacity: number;
  meetingLink: string;
  schedule: string;
  nextSessionAt: string;
  status: ClassStatus;
  completedOn?: string;
  finalAveragePercent?: number;
}

export interface EnrollmentRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  board: string;
  level: string;
  requestedSubjects: string[];
  message: string;
  requestedAt: string;
  status: RequestStatus;
  decidedAt?: string;
  outcome?: "one-on-one" | "class";
  parentName: string;
  parentEmail: string;
  mismatch: boolean;
}

export interface AssignmentAttachment {
  id: string;
  fileName: string;
  sizeBytes: number;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  description: string;
  targetType: "class" | "student";
  targetId: string;
  targetLabel: string;
  dueDate: string;
  maxGrade: number;
  allowLate: boolean;
  latePenaltyPercent: number;
  status: AssignmentStatus;
  notifyCount: number;
  publishedAt?: string;
  attachments: AssignmentAttachment[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt?: string;
  status: SubmissionStatus;
  text?: string;
  fileName?: string;
  fileSizeBytes?: number;
  grade?: number;
  feedback?: string;
  returnedForResubmission?: boolean;
}

export interface ScheduleEvent {
  id: string;
  startsAt: string;
  endsAt: string;
  kind: ScheduleEventKind;
  title: string;
  subtitle: string;
  classId?: string;
  location?: string;
  joinLink?: string;
}

export interface MeetingRequest {
  id: string;
  parentName: string;
  studentName: string;
  topic: string;
  note?: string;
  proposedTimes: string[];
  status: MeetingRequestStatus;
}

export interface MaterialItem {
  id: string;
  title: string;
  fileName: string;
  fileType: MaterialKind;
  sizeBytes: number;
  courseId: string;
  courseLabel: string;
  uploadedAt: string;
  description?: string;
}

export interface TicketMessage {
  id: string;
  author: "teacher" | "support";
  text: string;
  at: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  escalated?: boolean;
}

export interface TeacherPrivateNote {
  id: string;
  studentId: string;
  text: string;
  createdAt: string;
}

export interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceSessionRecord {
  id: string;
  classId: string;
  date: string;
  entries: AttendanceEntry[];
  editedAt?: string;
}

export interface TeacherNotification {
  id: string;
  kind: TeacherNotificationKind;
  text: string;
  tag: string;
  occurredAt: string;
  read: boolean;
  href: string;
}

export interface NeedsAttentionItem {
  id: string;
  kind: "grading" | "request" | "meeting" | "attendance";
  title: string;
  meta: string;
  href: string;
  severity: "warning" | "info";
}

export interface DeadlinesProgress {
  id: string;
  title: string;
  targetLabel: string;
  dueDate: string;
  submitted: number;
  total: number;
}

export interface ClassPerformancePoint {
  classLabel: string;
  averageGrade: number;
}

export interface SubmissionRatePoint {
  label: string;
  rate: number;
}

export interface GradebookColumn {
  assignmentId: string;
  title: string;
  dueDate: string;
  maxGrade: number;
}

export interface GradebookCell {
  assignmentId: string;
  studentId: string;
  value: number | null;
  late: boolean;
}

export interface GradebookRow {
  studentId: string;
  studentName: string;
  cells: GradebookCell[];
  average: number | null;
}

export interface GradebookForClass {
  classId: string;
  columns: GradebookColumn[];
  rows: GradebookRow[];
  columnAverages: { assignmentId: string; average: number | null }[];
}

export interface AttendanceDayStatus {
  date: string;
  status: AttendanceStatus;
}

export interface StudentActivityItem {
  id: string;
  text: string;
  at: string;
}

export interface StudentGradeLine {
  id: string;
  assignmentTitle: string;
  dueDate: string;
  submittedAt: string | null;
  grade: number | null;
  maxGrade: number;
  status: SubmissionStatus;
}
