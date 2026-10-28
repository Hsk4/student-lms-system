import type {
  AttendanceSessionRecord,
  ClassPerformancePoint,
  DeadlinesProgress,
  EnrollmentRequest,
  GradebookForClass,
  GradebookCell,
  GradebookRow,
  MaterialItem,
  MeetingRequest,
  NeedsAttentionItem,
  ScheduleEvent,
  StudentActivityItem,
  StudentGradeLine,
  Submission,
  SupportTicket,
  TeacherAssignment,
  TeacherClass,
  TeacherNotification,
  TeacherPrivateNote,
  TeacherProfile,
  TeacherStudent,
  SubmissionRatePoint,
} from "./types";

import { dateIn, daysAgoDateTime, todayAt } from "./date-utils";
import { daysBetween } from "@/lib/date";

/**
 * Simulate a brand-new teacher (no students/classes yet) to preview the
 * onboarding checklist on the dashboard. Flip to true to test that state.
 */
export const SIMULATE_NEW_TEACHER = false;

/* ------------------------------------------------------------------ */
/* currentTeacher — every collection below is scoped to this teacher.  */
/* Backend note: replace these arrays with queries filtered by the     */
/* signed-in teacher id (requireTeacherOf).                            */
/* ------------------------------------------------------------------ */

export const MOCK_TEACHER: TeacherProfile = {
  id: "tch-1",
  name: "Rohit Verma",
  email: "rohit.verma@school.edu",
  phone: "+91 98100 55221",
  bio:
    "Mathematics teacher with 8 years of experience across CBSE and ICSE. I focus on building strong fundamentals before test practice.",
  role: "Teacher",
  subject: "Mathematics",
  boards: ["CBSE Board", "ICSE Board"],
  levels: ["Grade 6", "Grade 7", "Grade 9", "Grade 10"],
};

const CLASSES: TeacherClass[] = [
  {
    id: "cls-1",
    name: "Mathematics G9 – Foundation",
    subject: "Mathematics",
    level: "Grade 9",
    board: "CBSE Board",
    capacity: 20,
    meetingLink: "https://meet.school.edu/math-g9",
    schedule: "Mon & Wed, 5:00 PM – 6:15 PM",
    nextSessionAt: dateIn(2, 17, 0),
    status: "current",
  },
  {
    id: "cls-2",
    name: "Mathematics G6 – Basics",
    subject: "Mathematics",
    level: "Grade 6",
    board: "CBSE Board",
    capacity: 15,
    meetingLink: "https://meet.school.edu/math-g6",
    schedule: "Sat & Sun, 10:00 AM – 11:15 AM",
    nextSessionAt: dateIn(1, 10, 0),
    status: "current",
  },
  {
    id: "cls-3",
    name: "Mathematics G10 – Board Prep",
    subject: "Mathematics",
    level: "Grade 10",
    board: "ICSE Board",
    capacity: 12,
    meetingLink: "https://meet.school.edu/math-g10",
    schedule: "Tue & Thu, 6:00 PM – 7:30 PM",
    nextSessionAt: dateIn(3, 18, 0),
    status: "current",
  },
  {
    id: "cls-p1",
    name: "Mathematics G8 – Summer Batch",
    subject: "Mathematics",
    level: "Grade 8",
    board: "CBSE Board",
    capacity: 15,
    meetingLink: "https://meet.school.edu/math-g8-summer",
    schedule: "Fridays, 4:00 PM",
    nextSessionAt: dateIn(-40, 16, 0),
    status: "previous",
    completedOn: dateIn(-38, 16, 0),
    finalAveragePercent: 78,
  },
];

function classLabelById(classId: string | null): string {
  const found = CLASSES.find((cls) => cls.id === classId);
  return found ? found.name : "One-on-one";
}

const STUDENTS: TeacherStudent[] = [
  {
    id: "stu-1024", name: "Aditi Sharma", board: "CBSE Board", level: "Grade 9",
    subject: "Mathematics", sessionType: "class", classId: "cls-1", status: "active",
    attendancePercent: 94, averageGradePercent: 86, onTimeSubmissionPercent: 92,
    lastActivityAt: daysAgoDateTime(1, 18, 30),
    parent: { name: "Kavita Sharma", email: "kavita.sharma@example.com" },
  },
  {
    id: "stu-1025", name: "Aarav Kapoor", board: "CBSE Board", level: "Grade 6",
    subject: "Mathematics", sessionType: "class", classId: "cls-2", status: "active",
    attendancePercent: 88, averageGradePercent: 72, onTimeSubmissionPercent: 80,
    lastActivityAt: daysAgoDateTime(2, 10, 15),
    parent: { name: "Nikki Kapoor", email: "nikki.kapoor@example.com" },
  },
  {
    id: "stu-1026", name: "Iman Tariq", board: "ICSE Board", level: "Grade 10",
    subject: "Mathematics", sessionType: "class", classId: "cls-3", status: "active",
    attendancePercent: 97, averageGradePercent: 91, onTimeSubmissionPercent: 96,
    lastActivityAt: daysAgoDateTime(1, 20, 5),
    parent: { name: "Saad Tariq", email: "saad.tariq@example.com" },
  },
  {
    id: "stu-2001", name: "Kabir Mehta", board: "CBSE Board", level: "Grade 9",
    subject: "Mathematics", sessionType: "class", classId: "cls-1", status: "active",
    attendancePercent: 82, averageGradePercent: 68, onTimeSubmissionPercent: 74,
    lastActivityAt: daysAgoDateTime(4, 17, 10),
    parent: { name: "Anjali Mehta", email: "anjali.mehta@example.com" },
  },
  {
    id: "stu-2002", name: "Naina Verma", board: "CBSE Board", level: "Grade 9",
    subject: "Mathematics", sessionType: "one-on-one", classId: null, status: "active",
    attendancePercent: 99, averageGradePercent: 88, onTimeSubmissionPercent: 95,
    lastActivityAt: daysAgoDateTime(3, 16, 40),
    parent: { name: "Suresh Verma", email: "suresh.verma@example.com" },
  },
  {
    id: "stu-2003", name: "Bilal Ahmed", board: "CBSE Board", level: "Grade 6",
    subject: "Mathematics", sessionType: "class", classId: "cls-2", status: "active",
    attendancePercent: 91, averageGradePercent: 77, onTimeSubmissionPercent: 85,
    lastActivityAt: daysAgoDateTime(1, 12, 0),
    parent: { name: "Farzana Ahmed", email: "farzana.ahmed@example.com" },
  },
  {
    id: "stu-2004", name: "Rehan Sheikh", board: "ICSE Board", level: "Grade 10",
    subject: "Mathematics", sessionType: "one-on-one", classId: null, status: "active",
    attendancePercent: 90, averageGradePercent: 83, onTimeSubmissionPercent: 88,
    lastActivityAt: daysAgoDateTime(2, 19, 0),
    parent: { name: "Amaana Sheikh", email: "amaana.sheikh@example.com" },
  },
  {
    id: "stu-2005", name: "Mahi Qureshi", board: "CBSE Board", level: "Grade 7",
    subject: "Mathematics", sessionType: "one-on-one", classId: null, status: "active",
    attendancePercent: 93, averageGradePercent: 79, onTimeSubmissionPercent: 82,
    lastActivityAt: daysAgoDateTime(5, 15, 30),
    parent: { name: "Tariq Qureshi", email: "tariq.qureshi@example.com" },
  },
  {
    id: "stu-2006", name: "Dhruv Nair", board: "ICSE Board", level: "Grade 10",
    subject: "Mathematics", sessionType: "class", classId: "cls-3", status: "active",
    attendancePercent: 86, averageGradePercent: 74, onTimeSubmissionPercent: 78,
    lastActivityAt: daysAgoDateTime(2, 18, 20),
    parent: { name: "Lata Nair", email: "lata.nair@example.com" },
  },
  {
    id: "stu-2007", name: "Ayesha Raza", board: "CBSE Board", level: "Grade 6",
    subject: "Mathematics", sessionType: "class", classId: "cls-2", status: "active",
    attendancePercent: 96, averageGradePercent: 90, onTimeSubmissionPercent: 93,
    lastActivityAt: daysAgoDateTime(0, 11, 5),
    parent: { name: "Imran Raza", email: "imran.raza@example.com" },
  },
  {
    id: "stu-2008", name: "Samir Khan", board: "CBSE Board", level: "Grade 9",
    subject: "Mathematics", sessionType: "class", classId: "cls-1", status: "active",
    attendancePercent: 79, averageGradePercent: 66, onTimeSubmissionPercent: 70,
    lastActivityAt: daysAgoDateTime(6, 14, 0),
    parent: { name: "Nasreen Khan", email: "nasreen.khan@example.com" },
  },
  {
    id: "stu-2009", name: "Tara Saxena", board: "ICSE Board", level: "Grade 10",
    subject: "Mathematics", sessionType: "class", classId: "cls-3", status: "completed",
    attendancePercent: 88, averageGradePercent: 81, onTimeSubmissionPercent: 86,
    lastActivityAt: daysAgoDateTime(30, 18, 0),
    parent: { name: "Vikas Saxena", email: "vikas.saxena@example.com" },
  },
  {
    id: "stu-2010", name: "Preethi Rao", board: "CBSE Board", level: "Grade 9",
    subject: "Mathematics", sessionType: "class", classId: "cls-3", status: "active",
    attendancePercent: 92, averageGradePercent: 84, onTimeSubmissionPercent: 89,
    lastActivityAt: daysAgoDateTime(2, 20, 40),
    parent: { name: "Deepak Rao", email: "deepak.rao@example.com" },
  },
  {
    id: "stu-2011", name: "Rhea Malhotra", board: "CBSE Board", level: "Grade 9",
    subject: "Mathematics", sessionType: "class", classId: "cls-1", status: "active",
    attendancePercent: 95, averageGradePercent: 87, onTimeSubmissionPercent: 91,
    lastActivityAt: daysAgoDateTime(0, 12, 10),
    parent: { name: "Sanjay Malhotra", email: "sanjay.malhotra@example.com" },
  },
  {
    id: "stu-2012", name: "Noor Fatima", board: "CBSE Board", level: "Grade 6",
    subject: "Mathematics", sessionType: "class", classId: "cls-2", status: "active",
    attendancePercent: 89, averageGradePercent: 75, onTimeSubmissionPercent: 83,
    lastActivityAt: daysAgoDateTime(1, 15, 0),
    parent: { name: "Aqeel Fatima", email: "aqeel.fatima@example.com" },
  },
];

const REQUESTS: EnrollmentRequest[] = [
  {
    id: "req-1", studentId: "stu-b1", studentName: "Farah Siddiqui",
    studentEmail: "farah.siddiqui@example.com", board: "CBSE Board", level: "Grade 9",
    requestedSubjects: ["Mathematics"],
    message: "Hello sir, I need help with quadratics and coordinate geometry before the term test.",
    requestedAt: daysAgoDateTime(0, 9, 10), status: "pending",
    parentName: "Waheed Siddiqui", parentEmail: "waheed.siddiqui@example.com",
    mismatch: false,
  },
  {
    id: "req-2", studentId: "stu-b2", studentName: "Vihaan Gupta",
    studentEmail: "vihaan.gupta@example.com", board: "CBSE Board", level: "Grade 6",
    requestedSubjects: ["Mathematics"],
    message: "My daughter is switching schools and needs a refresher on fractions.",
    requestedAt: daysAgoDateTime(0, 8, 25), status: "pending",
    parentName: "Ritu Gupta", parentEmail: "ritu.gupta@example.com",
    mismatch: true,
  },
  {
    id: "req-3", studentId: "stu-b3", studentName: "Zoya Malik",
    studentEmail: "zoya.malik@example.com", board: "ICSE Board", level: "Grade 10",
    requestedSubjects: ["Mathematics"],
    message: "Board exam prep for February, availability over weekends preferred.",
    requestedAt: daysAgoDateTime(1, 19, 40), status: "pending",
    parentName: "Naseem Malik", parentEmail: "naseem.malik@example.com",
    mismatch: false,
  },
  {
    id: "req-4", studentId: "stu-2010", studentName: "Preethi Rao",
    studentEmail: "preethi.rao@example.com", board: "CBSE Board", level: "Grade 9",
    requestedSubjects: ["Mathematics"],
    message: "Group class preferred if seats are open.",
    requestedAt: daysAgoDateTime(6, 12, 0), status: "accepted",
    decidedAt: daysAgoDateTime(4, 10, 0), outcome: "class",
    parentName: "Deepak Rao", parentEmail: "deepak.rao@example.com",
    mismatch: false,
  },
  {
    id: "req-5", studentId: "stu-b5", studentName: "Marcus D'Souza",
    studentEmail: "marcus.dsouza@example.com", board: "Federal Board", level: "Grade 12",
    requestedSubjects: ["Further Mathematics"],
    message: "Looking for advanced calculus coaching.",
    requestedAt: daysAgoDateTime(9, 16, 30), status: "declined",
    decidedAt: daysAgoDateTime(7, 11, 0),
    parentName: "Fiona D'Souza", parentEmail: "fiona.dsouza@example.com",
    mismatch: true,
  },
];

const ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: "asg-1", title: "Triangles problem set",
    description: "Solve exercises 6.1 to 6.4 from the workbook. Show every step of your reasoning.",
    targetType: "class", targetId: "cls-1", targetLabel: "Mathematics G9 – Foundation",
    dueDate: dateIn(1, 23, 59), maxGrade: 100, allowLate: true, latePenaltyPercent: 5,
    status: "published", notifyCount: 4, publishedAt: daysAgoDateTime(3, 9, 0),
    attachments: [{ id: "att-1", fileName: "triangles-worksheet.pdf", sizeBytes: 243409 }],
  },
  {
    id: "asg-2", title: "Fractions word problems",
    description: "Ten word problems on fractions. Write the operation you used in words.",
    targetType: "class", targetId: "cls-2", targetLabel: "Mathematics G6 – Basics",
    dueDate: dateIn(2, 22, 0), maxGrade: 50, allowLate: false, latePenaltyPercent: 0,
    status: "published", notifyCount: 4, publishedAt: daysAgoDateTime(4, 11, 0),
    attachments: [],
  },
  {
    id: "asg-3", title: "Trigonometry unit test revision",
    description: "Attempt the revision paper and record your score breakdown by question.",
    targetType: "student", targetId: "stu-2004", targetLabel: "Rehan Sheikh",
    dueDate: dateIn(4, 20, 0), maxGrade: 100, allowLate: true, latePenaltyPercent: 10,
    status: "published", notifyCount: 1, publishedAt: daysAgoDateTime(2, 15, 0),
    attachments: [{ id: "att-2", fileName: "trig-revision-paper.pdf", sizeBytes: 519220 }],
  },
  {
    id: "asg-4", title: "Mensuration practice – cylinder and sphere",
    description: "Ten numerical problems from chapter 11. Keep decimal answers to 2 places.",
    targetType: "class", targetId: "cls-3", targetLabel: "Mathematics G10 – Board Prep",
    dueDate: dateIn(5, 23, 59), maxGrade: 100, allowLate: false, latePenaltyPercent: 0,
    status: "published", notifyCount: 3, publishedAt: daysAgoDateTime(1, 8, 30),
    attachments: [],
  },
  {
    id: "asg-5", title: "Factorising timed assignment",
    description: "Fifteen factorisation problems, 30 minutes, closed book.",
    targetType: "class", targetId: "cls-1", targetLabel: "Mathematics G9 – Foundation",
    dueDate: daysAgoDateTime(2, 22, 0), maxGrade: 100, allowLate: true, latePenaltyPercent: 5,
    status: "published", notifyCount: 4, publishedAt: daysAgoDateTime(7, 9, 0),
    attachments: [],
  },
  {
    id: "asg-6", title: "Geometry vocabulary quiz",
    description: "Match the definitions of 15 terms. One attempt.",
    targetType: "class", targetId: "cls-2", targetLabel: "Mathematics G6 – Basics",
    dueDate: daysAgoDateTime(5, 22, 0), maxGrade: 50, allowLate: false, latePenaltyPercent: 0,
    status: "closed", notifyCount: 4, publishedAt: daysAgoDateTime(10, 9, 0),
    attachments: [],
  },
  {
    id: "asg-7", title: "Linear equations – mixed set",
    description: "Twelve linear equations across one, two and three variables.",
    targetType: "class", targetId: "cls-1", targetLabel: "Mathematics G9 – Foundation",
    dueDate: daysAgoDateTime(8, 22, 0), maxGrade: 100, allowLate: true, latePenaltyPercent: 5,
    status: "closed", notifyCount: 4, publishedAt: daysAgoDateTime(14, 9, 0),
    attachments: [],
  },
  {
    id: "asg-8", title: "Statistics project outline (draft)",
    description: "Draft outline only – pick a survey topic and list 5 charts you plan to use.",
    targetType: "class", targetId: "cls-3", targetLabel: "Mathematics G10 – Board Prep",
    dueDate: dateIn(9, 23, 59), maxGrade: 50, allowLate: true, latePenaltyPercent: 0,
    status: "draft", notifyCount: 3,
    attachments: [],
  },
];

const SUBMISSIONS: Submission[] = [
  // asg-1 (Triangles, G9, due in 1 day)
  { id: "sub-101", assignmentId: "asg-1", studentId: "stu-1024", studentName: "Aditi Sharma", submittedAt: daysAgoDateTime(0, 14, 5), status: "submitted", text: "Completed exercises 6.1–6.3 fully, attempted 6.4 first four parts.", fileName: "aditi-triangles.pdf", fileSizeBytes: 402115 },
  { id: "sub-102", assignmentId: "asg-1", studentId: "stu-2001", studentName: "Kabir Mehta", submittedAt: daysAgoDateTime(3, 20, 45), status: "late", text: "Posted late, sorry – school trip week.", fileName: "kabir-triangles.pdf", fileSizeBytes: 386550 },
  { id: "sub-103", assignmentId: "asg-1", studentId: "stu-2008", studentName: "Samir Khan", status: "missing" },
  { id: "sub-104", assignmentId: "asg-1", studentId: "stu-2011", studentName: "Rhea Malhotra", submittedAt: daysAgoDateTime(0, 12, 10), status: "submitted", text: "All four exercises attempted, doubts on 6.4(c).", fileName: "rhea-triangles.pdf", fileSizeBytes: 254321 },

  // asg-2 (Fractions, G6, due in 2 days)
  { id: "sub-105", assignmentId: "asg-2", studentId: "stu-1025", studentName: "Aarav Kapoor", submittedAt: daysAgoDateTime(0, 10, 40), status: "submitted", text: "Completed 8 of 10, stuck on word problems 9 and 10.", fileName: "aarav-fractions.pdf", fileSizeBytes: 190240 },
  { id: "sub-106", assignmentId: "asg-2", studentId: "stu-2003", studentName: "Bilal Ahmed", submittedAt: daysAgoDateTime(1, 9, 30), status: "submitted", text: "Completed all ten problems with steps.", fileName: "bilal-fractions.pdf", fileSizeBytes: 201450 },
  { id: "sub-107", assignmentId: "asg-2", studentId: "stu-2007", studentName: "Ayesha Raza", status: "missing" },
  { id: "sub-108", assignmentId: "asg-2", studentId: "stu-2012", studentName: "Noor Fatima", submittedAt: daysAgoDateTime(0, 19, 15), status: "late", text: "Finished late after cricket practice.", fileName: "noor-fractions.pdf", fileSizeBytes: 175000 },

  // asg-5 (Factorising, G9, closed 2 days ago) – oldest ungraded queue
  { id: "sub-109", assignmentId: "asg-5", studentId: "stu-1024", studentName: "Aditi Sharma", submittedAt: daysAgoDateTime(6, 18, 0), status: "submitted", text: "15/15 attempted, two sign errors in (iii).", fileName: "aditi-factorising.pdf", fileSizeBytes: 301220 },
  { id: "sub-110", assignmentId: "asg-5", studentId: "stu-2001", studentName: "Kabir Mehta", submittedAt: daysAgoDateTime(1, 21, 5), status: "late", text: "Late but complete – family emergency last week.", fileName: "kabir-factorising.pdf", fileSizeBytes: 288400 },
  { id: "sub-111", assignmentId: "asg-5", studentId: "stu-2008", studentName: "Samir Khan", submittedAt: daysAgoDateTime(4, 16, 0), status: "submitted", text: "Attempted 12 of 15, found middle-term splitting hard.", fileName: "samir-factorising.pdf", fileSizeBytes: 261300 },
  { id: "sub-112", assignmentId: "asg-5", studentId: "stu-2011", studentName: "Rhea Malhotra", submittedAt: daysAgoDateTime(3, 17, 20), status: "submitted", text: "All complete, showing working for every step.", fileName: "rhea-factorising.pdf", fileSizeBytes: 298770 },

  // asg-6 (Geometry quiz, G6, closed 5 days ago) – already graded
  { id: "sub-113", assignmentId: "asg-6", studentId: "stu-1025", studentName: "Aarav Kapoor", submittedAt: daysAgoDateTime(5, 20, 0), status: "graded", grade: 41, feedback: "Good recall of terms, watch quadrilateral properties." },
  { id: "sub-114", assignmentId: "asg-6", studentId: "stu-2003", studentName: "Bilal Ahmed", submittedAt: daysAgoDateTime(5, 18, 30), status: "graded", grade: 45, feedback: "Excellent – almost all correct." },
  { id: "sub-115", assignmentId: "asg-6", studentId: "stu-2007", studentName: "Ayesha Raza", submittedAt: daysAgoDateTime(5, 16, 45), status: "graded", grade: 48, feedback: "Top of the class on this one." },
  { id: "sub-116", assignmentId: "asg-6", studentId: "stu-2012", studentName: "Noor Fatima", submittedAt: daysAgoDateTime(5, 19, 10), status: "graded", grade: 39, feedback: "Confusing polygons with polyhedra – revise section 4." },

  // asg-7 (Linear equations, G9, closed 8 days ago) – graded
  { id: "sub-117", assignmentId: "asg-7", studentId: "stu-1024", studentName: "Aditi Sharma", submittedAt: daysAgoDateTime(8, 17, 0), status: "graded", grade: 88, feedback: "Very clean work. Re-check elimination in Q7." },
  { id: "sub-118", assignmentId: "asg-7", studentId: "stu-2001", studentName: "Kabir Mehta", submittedAt: daysAgoDateTime(8, 15, 30), status: "graded", grade: 64, feedback: "Method is right, arithmetic slips cost marks." },
  { id: "sub-119", assignmentId: "asg-7", studentId: "stu-2008", studentName: "Samir Khan", submittedAt: daysAgoDateTime(8, 20, 15), status: "graded", grade: 71, feedback: "Improving – slow down on sign changes." },
  { id: "sub-120", assignmentId: "asg-7", studentId: "stu-2011", studentName: "Rhea Malhotra", submittedAt: daysAgoDateTime(8, 14, 45), status: "graded", grade: 92, feedback: "Excellent paper, very systematic." },

  // asg-3 (Trig revision, Rehan one-on-one)
  { id: "sub-121", assignmentId: "asg-3", studentId: "stu-2004", studentName: "Rehan Sheikh", submittedAt: daysAgoDateTime(2, 21, 50), status: "submitted", text: "Revision paper done, scored myself 76/100.", fileName: "rehan-trig.pdf", fileSizeBytes: 356200 },

  // asg-4 (Mensuration, G10)
  { id: "sub-122", assignmentId: "asg-4", studentId: "stu-1026", studentName: "Iman Tariq", submittedAt: daysAgoDateTime(0, 16, 25), status: "submitted", text: "Ten problems complete with working.", fileName: "iman-mensuration.pdf", fileSizeBytes: 223000 },
  { id: "sub-123", assignmentId: "asg-4", studentId: "stu-2006", studentName: "Dhruv Nair", status: "missing" },
  { id: "sub-124", assignmentId: "asg-4", studentId: "stu-2010", studentName: "Preethi Rao", submittedAt: daysAgoDateTime(1, 11, 15), status: "late", text: "Submitted after school hours.", fileName: "preethi-mensuration.pdf", fileSizeBytes: 208900 },
];

/* Rosters come straight from this teacher's student list — there is no
   shared "all students" pool anywhere in the app. */
function fullRosterStudents(classId: string): { id: string; name: string }[] {
  return STUDENTS.filter(
    (student) => student.classId === classId && student.status === "active",
  ).map((student) => ({ id: student.id, name: student.name }));
}

const SCHEDULE_EVENTS: ScheduleEvent[] = [
  // Today (timeline)
  { id: "ev-t0", startsAt: todayAt(9, 0), endsAt: todayAt(9, 45), kind: "one-on-one", title: "One-on-one – Mahi Qureshi", subtitle: "Grade 7 · Mathematics" },
  { id: "ev-t1", startsAt: todayAt(17, 0), endsAt: todayAt(18, 15), kind: "class", title: "Mathematics G9 – Foundation", subtitle: "4 students · Chapter 6", classId: "cls-1" },
  { id: "ev-t2", startsAt: todayAt(19, 0), endsAt: todayAt(19, 45), kind: "one-on-one", title: "One-on-one – Rehan Sheikh", subtitle: "Grade 10 · Trig revision", joinLink: "https://meet.school.edu/rehan-rv" },
  { id: "ev-t3", startsAt: todayAt(20, 30), endsAt: todayAt(21, 15), kind: "meeting", title: "Parent meeting – Anjali Mehta", subtitle: "Kabir's progress review", location: "Online session" },
  // Coming days
  { id: "ev-d1", startsAt: dateIn(1, 10, 0), endsAt: dateIn(1, 11, 15), kind: "class", title: "Mathematics G6 – Basics", subtitle: "4 students · Fractions", classId: "cls-2" },
  { id: "ev-d2", startsAt: dateIn(1, 17, 0), endsAt: dateIn(1, 18, 15), kind: "class", title: "Mathematics G9 – Foundation", subtitle: "4 students · Triangles", classId: "cls-1" },
  { id: "ev-d3", startsAt: dateIn(2, 17, 0), endsAt: dateIn(2, 18, 15), kind: "class", title: "Mathematics G9 – Foundation", subtitle: "4 students", classId: "cls-1" },
  { id: "ev-d4", startsAt: dateIn(3, 18, 0), endsAt: dateIn(3, 19, 30), kind: "class", title: "Mathematics G10 – Board Prep", subtitle: "3 students · Mensuration", classId: "cls-3" },
  { id: "ev-d5", startsAt: dateIn(3, 16, 0), endsAt: dateIn(3, 16, 45), kind: "one-on-one", title: "One-on-one – Naina Verma", subtitle: "Grade 9 · Coordinate geometry" },
  { id: "ev-d6", startsAt: dateIn(5, 10, 0), endsAt: dateIn(5, 11, 15), kind: "class", title: "Mathematics G6 – Basics", subtitle: "4 students", classId: "cls-2" },
  { id: "ev-d7", startsAt: dateIn(6, 17, 0), endsAt: dateIn(6, 18, 15), kind: "class", title: "Mathematics G9 – Foundation", subtitle: "4 students", classId: "cls-1" },
  { id: "ev-d8", startsAt: dateIn(-1, 17, 0), endsAt: dateIn(-1, 18, 15), kind: "class", title: "Mathematics G9 – Foundation", subtitle: "4 students", classId: "cls-1" },
  { id: "ev-d9", startsAt: dateIn(-2, 18, 0), endsAt: dateIn(-2, 19, 30), kind: "class", title: "Mathematics G10 – Board Prep", subtitle: "3 students", classId: "cls-3" },
  { id: "ev-d10", startsAt: dateIn(-12, 17, 0), endsAt: dateIn(-12, 18, 15), kind: "meeting", title: "Parent meeting – Suresh Verma", subtitle: "Naina's improvement plan", location: "Online session" },
];

const MEETING_REQUESTS: MeetingRequest[] = [
  {
    id: "mrq-1", parentName: "Anjali Mehta", studentName: "Kabir Mehta",
    topic: "Progress discussion",
    note: "Can we talk before the term tests begin?",
    proposedTimes: [dateIn(1, 11, 0), dateIn(2, 20, 30)],
    status: "pending",
  },
  {
    id: "mrq-2", parentName: "Lata Nair", studentName: "Dhruv Nair",
    topic: "Attendance and focus in class",
    proposedTimes: [dateIn(4, 19, 0)],
    status: "pending",
  },
  {
    id: "mrq-3", parentName: "Imran Raza", studentName: "Ayesha Raza",
    topic: "Olympiad preparation guidance",
    proposedTimes: [dateIn(2, 10, 30), dateIn(3, 10, 30)],
    status: "confirmed",
  },
];

const MATERIALS: MaterialItem[] = [
  { id: "mat-1", title: "Triangles worksheet pack", fileName: "triangles-worksheet.pdf", fileType: "worksheet", sizeBytes: 243409, courseId: "cls-1", courseLabel: "Mathematics G9 – Foundation", uploadedAt: daysAgoDateTime(3, 9, 5), description: "Extra practice for chapter 6." },
  { id: "mat-2", title: "Fraction visual notes", fileName: "fraction-visual-notes.pdf", fileType: "pdf", sizeBytes: 512000, courseId: "cls-2", courseLabel: "Mathematics G6 – Basics", uploadedAt: daysAgoDateTime(4, 11, 20) },
  { id: "mat-3", title: "Trig identities quick sheet", fileName: "trig-identities.png", fileType: "slides", sizeBytes: 318000, courseId: "stu-2004", courseLabel: "Rehan Sheikh (one-on-one)", uploadedAt: daysAgoDateTime(6, 15, 0) },
  { id: "mat-4", title: "Mensuration formula chart", fileName: "mensuration-chart.pdf", fileType: "pdf", sizeBytes: 187400, courseId: "cls-3", courseLabel: "Mathematics G10 – Board Prep", uploadedAt: daysAgoDateTime(8, 10, 0), description: "Print and keep on the study table." },
  { id: "mat-5", title: "Quadratics walkthrough (recording)", fileName: "quadratics-walkthrough.mp4", fileType: "video", sizeBytes: 84992000, courseId: "cls-1", courseLabel: "Mathematics G9 – Foundation", uploadedAt: daysAgoDateTime(9, 18, 45) },
  { id: "mat-6", title: "Geometry vocabulary list", fileName: "geometry-vocab.xlsx", fileType: "worksheet", sizeBytes: 66200, courseId: "cls-2", courseLabel: "Mathematics G6 – Basics", uploadedAt: daysAgoDateTime(12, 9, 40) },
  { id: "mat-7", title: "Khan Academy – statistics basics", fileName: "https://khanacademy.org/statistics", fileType: "link", sizeBytes: 0, courseId: "cls-3", courseLabel: "Mathematics G10 – Board Prep", uploadedAt: daysAgoDateTime(14, 12, 0) },
  { id: "mat-8", title: "Board exam sample paper 2026", fileName: "sample-paper-2026.pdf", fileType: "pdf", sizeBytes: 402000, courseId: "cls-3", courseLabel: "Mathematics G10 – Board Prep", uploadedAt: daysAgoDateTime(18, 16, 30) },
];

const TICKETS: SupportTicket[] = [
  {
    id: "tk-1", subject: "Attendance export missing weekend sessions", category: "Technical bug",
    status: "open", createdAt: daysAgoDateTime(2, 10, 0), updatedAt: daysAgoDateTime(0, 14, 30), escalated: true,
    messages: [
      { id: "tm-1", author: "teacher", text: "When I export attendance, Saturday sessions are missing from the report.", at: daysAgoDateTime(2, 10, 0) },
      { id: "tm-2", author: "support", text: "Thanks for reporting. Could you confirm which class and weeks are affected?", at: daysAgoDateTime(1, 9, 15) },
      { id: "tm-3", author: "teacher", text: "Mathematics G6 class, last three weekends. I have attached a screenshot in the portal.", at: daysAgoDateTime(0, 14, 30) },
    ],
  },
  {
    id: "tk-2", subject: "Change weekly availability after winter break", category: "Account",
    status: "open", createdAt: daysAgoDateTime(1, 18, 20), updatedAt: daysAgoDateTime(1, 18, 20),
    messages: [
      { id: "tm-4", author: "teacher", text: "I need to move my Thursday evening slot earlier from next month.", at: daysAgoDateTime(1, 18, 20) },
    ],
  },
  {
    id: "tk-3", subject: "Wrong board label on G10 class", category: "Data correction",
    status: "resolved", createdAt: daysAgoDateTime(12, 11, 0), updatedAt: daysAgoDateTime(10, 16, 0),
    messages: [
      { id: "tm-5", author: "teacher", text: "The G10 classes shows ICSE but two of my students are on the CBSE paper series.", at: daysAgoDateTime(12, 11, 0) },
      { id: "tm-6", author: "support", text: "Corrected with the admin team – students were moved to the right series.", at: daysAgoDateTime(10, 16, 0) },
    ],
  },
  {
    id: "tk-4", subject: "Printing issue on gradebook", category: "Technical bug",
    status: "resolved", createdAt: daysAgoDateTime(20, 9, 0), updatedAt: daysAgoDateTime(18, 13, 40),
    messages: [
      { id: "tm-7", author: "teacher", text: "Print preview cuts off the last assignment column.", at: daysAgoDateTime(20, 9, 0) },
      { id: "tm-8", author: "support", text: "Fix deployed on 12 Oct. Landscape mode now fits all columns.", at: daysAgoDateTime(18, 13, 40) },
    ],
  },
];

const NOTES: TeacherPrivateNote[] = [
  { id: "note-1", studentId: "stu-1024", text: "Very consistent in class. Push her toward olympiad-level problems after term tests.", createdAt: daysAgoDateTime(2, 18, 40) },
  { id: "note-2", studentId: "stu-1024", text: "Signed her up for the additional Saturday doubt-session.", createdAt: daysAgoDateTime(9, 12, 0) },
  { id: "note-3", studentId: "stu-2001", text: "Struggles with multi-step word problems. Plan: 4 guided examples per week, then independent attempts.", createdAt: daysAgoDateTime(1, 17, 50) },
  { id: "note-4", studentId: "stu-2005", text: "Parents requested slower pace for algebra. Agreed – revisit in 3 weeks.", createdAt: daysAgoDateTime(5, 15, 10) },
  { id: "note-5", studentId: "stu-2006", text: "Attendance slipping – alarmed parent. Watch over the next two Fridays.", createdAt: daysAgoDateTime(3, 19, 30) },
];

const ATTENDANCE_RECORDS: AttendanceSessionRecord[] = [
  {
    id: "att-1", classId: "cls-1", date: daysAgoDateTime(2, 17, 0).slice(0, 10),
    editedAt: daysAgoDateTime(2, 18, 30),
    entries: [
      { studentId: "stu-1024", status: "present" },
      { studentId: "stu-2001", status: "present" },
      { studentId: "stu-2008", status: "absent", note: "Sick leave informed by parent" },
      { studentId: "stu-2011", status: "late", note: "Bus delay" },
    ],
  },
  {
    id: "att-2", classId: "cls-1", date: daysAgoDateTime(4, 17, 0).slice(0, 10),
    entries: [
      { studentId: "stu-1024", status: "present" },
      { studentId: "stu-2001", status: "late" },
      { studentId: "stu-2008", status: "absent" },
      { studentId: "stu-2011", status: "present" },
    ],
  },
  {
    id: "att-3", classId: "cls-2", date: daysAgoDateTime(1, 10, 0).slice(0, 10),
    editedAt: daysAgoDateTime(1, 11, 5),
    entries: [
      { studentId: "stu-1025", status: "present" },
      { studentId: "stu-2003", status: "present" },
      { studentId: "stu-2007", status: "excused", note: "School sports meet" },
      { studentId: "stu-2012", status: "present" },
    ],
  },
  {
    id: "att-4", classId: "cls-2", date: daysAgoDateTime(8, 10, 0).slice(0, 10),
    entries: [
      { studentId: "stu-1025", status: "absent" },
      { studentId: "stu-2003", status: "present" },
      { studentId: "stu-2007", status: "present" },
      { studentId: "stu-2012", status: "present" },
    ],
  },
];

const NOTIFICATIONS: TeacherNotification[] = [
  { id: "tn-1", kind: "request", text: "New enrollment request from Farah Siddiqui (Grade 9)", tag: "Requests", occurredAt: daysAgoDateTime(0, 9, 10), read: false, href: "/teacher/requests" },
  { id: "tn-2", kind: "meeting", text: "Anjali Mehta requested a meeting about Kabir", tag: "Schedule", occurredAt: daysAgoDateTime(0, 8, 40), read: false, href: "/teacher/schedule" },
  { id: "tn-3", kind: "submission", text: "Aditi Sharma submitted Triangles problem set", tag: "Assignments", occurredAt: daysAgoDateTime(0, 14, 5), read: false, href: "/teacher/assignments/asg-1" },
  { id: "tn-4", kind: "submission", text: "Kabir Mehta submitted late (Factorising assignment)", tag: "Grading", occurredAt: daysAgoDateTime(-1, 21, 5), read: true, href: "/teacher/grading" },
  { id: "tn-5", kind: "support", text: "Support replied to your attendance export ticket", tag: "Support", occurredAt: daysAgoDateTime(-1, 9, 15), read: true, href: "/teacher/support/tk-1" },
  { id: "tn-6", kind: "meeting", text: "Meeting confirmed with Imran Raza for Ayesha", tag: "Schedule", occurredAt: daysAgoDateTime(-2, 15, 0), read: true, href: "/teacher/schedule" },
  { id: "tn-7", kind: "request", text: "New enrollment request from Zoya Malik (Grade 10)", tag: "Requests", occurredAt: daysAgoDateTime(-1, 19, 40), read: true, href: "/teacher/requests" },
];

/* Weekly availability: Sat...Fri days x hours 9..18 (UI toggles these). */
export const AVAILABILITY_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const AVAILABILITY_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const;

const AVAILABILITY: boolean[][] = AVAILABILITY_DAYS.map((day, dayIndex) =>
  AVAILABILITY_HOURS.map((hour) => {
    if (dayIndex === 6) return false; // Sunday off
    if (dayIndex === 0 && hour >= 17) return true; // Mon/Wed evening classes
    if (dayIndex === 2 && hour >= 17) return true;
    if (dayIndex === 3 && hour >= 18) return true;
    if (dayIndex === 5 && hour >= 10) return hour >= 10 && hour < 14;
    if (dayIndex === 1 && hour >= 16) return true;
    return false;
  }),
);

export function getTeacherProfile(): TeacherProfile {
  return MOCK_TEACHER;
}

export function getAvailabilityMatrix(): boolean[][] {
  return AVAILABILITY.map((row) => [...row]);
}

export function getStudentsForTeacher(): TeacherStudent[] {
  return SIMULATE_NEW_TEACHER ? [] : STUDENTS;
}

export function getClassesForTeacher(status?: "current" | "previous"): TeacherClass[] {
  const active = SIMULATE_NEW_TEACHER ? [] : CLASSES;
  return status ? active.filter((cls) => cls.status === status) : active;
}

export function getClassById(classId: string): TeacherClass | undefined {
  return getClassesForTeacher().find((cls) => cls.id === classId);
}

export function getClassRoster(classId: string): { id: string; name: string }[] {
  return SIMULATE_NEW_TEACHER ? [] : fullRosterStudents(classId);
}

export function getStudentById(studentId: string): TeacherStudent | undefined {
  return getStudentsForTeacher().find((student) => student.id === studentId);
}

export function getEnrollmentRequests(): EnrollmentRequest[] {
  return SIMULATE_NEW_TEACHER ? [] : REQUESTS;
}

export function getPendingEnrollmentRequests(): EnrollmentRequest[] {
  return getEnrollmentRequests().filter((request) => request.status === "pending");
}

export function getEnrollmentRequestHistory(): EnrollmentRequest[] {
  return getEnrollmentRequests().filter((request) => request.status !== "pending");
}

export function getAssignmentsForTeacher(): TeacherAssignment[] {
  return SIMULATE_NEW_TEACHER ? [] : ASSIGNMENTS;
}

export function getAssignmentById(assignmentId: string): TeacherAssignment | undefined {
  return getAssignmentsForTeacher().find((assignment) => assignment.id === assignmentId);
}

export function getSubmissionsForAssignment(assignmentId: string): Submission[] {
  return SUBMISSIONS.filter((submission) => submission.assignmentId === assignmentId);
}

export function getSubmissionsForTeacher(): Submission[] {
  return SIMULATE_NEW_TEACHER ? [] : SUBMISSIONS;
}

export function getSubmissionCounts(assignment: TeacherAssignment): {
  submitted: number;
  total: number;
  graded: number;
} {
  const rows = getSubmissionsForAssignment(assignment.id);
  const submittedRows = rows.filter((row) => row.submittedAt);
  return {
    submitted: submittedRows.length,
    total: assignment.notifyCount,
    graded: rows.filter((row) => row.status === "graded").length,
  };
}

export function getUngradedSubmissions(): Submission[] {
  return getSubmissionsForTeacher()
    .filter((submission) => submission.submittedAt && submission.status !== "graded")
    .sort((a, b) => (a.submittedAt ?? "").localeCompare(b.submittedAt ?? ""));
}

export function getUngradedOlderThan3Days(): Submission[] {
  return getUngradedSubmissions().filter(
    (submission) => daysBetween(submission.submittedAt ?? "") > 3,
  );
}

export function getRecentSubmissions(limit: number): Submission[] {
  return getSubmissionsForTeacher()
    .filter((submission) => submission.submittedAt)
    .sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""))
    .slice(0, limit);
}

export function getScheduleEvents(): ScheduleEvent[] {
  return SIMULATE_NEW_TEACHER ? [] : SCHEDULE_EVENTS;
}

export function getScheduleEventsForDate(date: Date): ScheduleEvent[] {
  const target = date.toISOString().slice(0, 10);
  return getScheduleEvents()
    .filter((event) => event.startsAt.slice(0, 10) === target)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function getMeetingRequests(): MeetingRequest[] {
  return SIMULATE_NEW_TEACHER ? [] : MEETING_REQUESTS;
}

export function getPendingMeetingRequests(): MeetingRequest[] {
  return getMeetingRequests().filter((request) => request.status === "pending");
}

export function getMaterialsForTeacher(): MaterialItem[] {
  return SIMULATE_NEW_TEACHER ? [] : MATERIALS;
}

export function getSupportTickets(): SupportTicket[] {
  return SIMULATE_NEW_TEACHER ? [] : TICKETS;
}

export function getTicketById(ticketId: string): SupportTicket | undefined {
  return getSupportTickets().find((ticket) => ticket.id === ticketId);
}

export function getPrivateNotes(): TeacherPrivateNote[] {
  return SIMULATE_NEW_TEACHER ? [] : NOTES;
}

export function getPrivateNotesForStudent(studentId: string): TeacherPrivateNote[] {
  return getPrivateNotes()
    .filter((note) => note.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getAttendanceRecordsForTeacher(): AttendanceSessionRecord[] {
  return SIMULATE_NEW_TEACHER ? [] : ATTENDANCE_RECORDS;
}

export function getAttendanceRecord(classId: string, date: Date): AttendanceSessionRecord | undefined {
  const key = date.toISOString().slice(0, 10);
  return getAttendanceRecordsForTeacher().find(
    (record) => record.classId === classId && record.date === key,
  );
}

export function getTeacherNotifications(): TeacherNotification[] {
  return SIMULATE_NEW_TEACHER ? [] : NOTIFICATIONS;
}

export function getAssignmentsForStudent(studentId: string): {
  assignment: TeacherAssignment;
  submission: Submission | undefined;
}[] {
  return getAssignmentsForTeacher()
    .filter(
      (assignment) =>
        (assignment.targetType === "student" && assignment.targetId === studentId) ||
        (assignment.targetType === "class" &&
          fullRosterStudents(assignment.targetId).some((row) => row.id === studentId)),
    )
    .map((assignment) => ({
      assignment,
      submission: getSubmissionsForAssignment(assignment.id).find(
        (submission) => submission.studentId === studentId,
      ),
    }));
}

export function getStudentGradeLines(studentId: string): StudentGradeLine[] {
  return getAssignmentsForStudent(studentId).map(({ assignment, submission }) => ({
    id: assignment.id,
    assignmentTitle: assignment.title,
    dueDate: assignment.dueDate,
    submittedAt: submission?.submittedAt ?? null,
    grade: submission?.grade ?? null,
    maxGrade: assignment.maxGrade,
    status: submission?.status ?? ("missing" as never),
  }));
}

let trendSeed = 0;
function seededPercent(base: number, spread: number, index: number): number {
  const bump = ((index * 7 + trendSeed) % spread) - 4;
  return Math.max(40, Math.min(100, base + bump));
}

export function getGradeTrendPoints(seedId: string): { date: string; percent: number }[] {
  trendSeed = seedId.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const base = (trendSeed % 17) + 68;
  return Array.from({ length: 10 }, (_, index) => ({
    date: daysAgoDateTime(42 - index * 4, 10, 0),
    percent: seededPercent(base, 15, index),
  }));
}

export function getStudentActivity(studentId: string): StudentActivityItem[] {
  const items = getAssignmentsForStudent(studentId).flatMap(({ assignment, submission }) => {
    if (!submission?.submittedAt) return [];
    return [
      {
        id: submission.id,
        text: `Submitted "${assignment.title}"`,
        at: submission.submittedAt,
      },
      ...(submission.grade !== undefined && submission.grade !== null
        ? [{
            id: `${submission.id}-g`,
            text: `Grade returned for "${assignment.title}": ${submission.grade}/${assignment.maxGrade}`,
            at: daysAgoDateTime(1, 10, 0),
          }]
        : []),
    ];
  });
  return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8);
}

/* ---------------- dashboard aggregations (T1) ---------------- */

export function getDashboardKpis() {
  return {
    activeStudents: getStudentsForTeacher().filter((s) => s.status === "active").length,
    pendingRequests: getPendingEnrollmentRequests().length,
    toGrade: getUngradedSubmissions().length,
    sessionsToday: getScheduleEventsForDate(new Date()).filter(
      (event) => event.kind !== "meeting",
    ).length,
  };
}

export function getNeedsAttention(): NeedsAttentionItem[] {
  const items: NeedsAttentionItem[] = [];

  getUngradedOlderThan3Days().forEach((submission) => {
    const assignment = getAssignmentById(submission.assignmentId);
    items.push({
      id: `na-grading-${submission.id}`,
      kind: "grading",
      title: "Grading overdue",
      meta: `${submission.studentName} · ${assignment?.title ?? "Assignment"} · waiting ${Math.max(1, daysBetween(submission.submittedAt ?? ""))} days`,
      href: "/teacher/grading",
      severity: "warning",
    });
  });

  getPendingEnrollmentRequests().forEach((request) => {
    items.push({
      id: `na-request-${request.id}`,
      kind: "request",
      title: "New enrollment request",
      meta: `${request.studentName} · ${request.level} · ${request.requestedSubjects.join(", ")}`,
      href: "/teacher/requests",
      severity: "info",
    });
  });

  getPendingMeetingRequests().forEach((request) => {
    items.push({
      id: `na-meeting-${request.id}`,
      kind: "meeting",
      title: "Parent meeting request",
      meta: `${request.parentName} · ${request.studentName} · ${request.topic}`,
      href: "/teacher/schedule",
      severity: "info",
    });
  });

  getClassesForTeacher("current").forEach((cls) => {
    if (cls.id === "cls-1") {
      items.push({
        id: `na-attendance-${cls.id}`,
        kind: "attendance",
        title: "Low attendance",
        meta: `${cls.name} · 2 absences this week`,
        href: "/teacher/attendance",
        severity: "info",
      });
    }
  });

  return items;
}

export function getUpcomingDeadlines(): DeadlinesProgress[] {
  return getAssignmentsForTeacher()
    .filter((assignment) => assignment.status !== "draft")
    .map((assignment) => {
      const counts = getSubmissionCounts(assignment);
      return {
        id: assignment.id,
        title: assignment.title,
        targetLabel: assignment.targetLabel,
        dueDate: assignment.dueDate,
        submitted: counts.submitted,
        total: counts.total,
      };
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);
}

export function getClassPerformance(): ClassPerformancePoint[] {
  return getClassesForTeacher("current").map((cls) => {
    const roster = getClassRoster(cls.id);
    const values = roster
      .map((row) => getStudentById(row.id)?.averageGradePercent ?? 0)
      .filter((value) => value > 0);
    const average = values.length
      ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
      : 0;
    return { classLabel: cls.name.replace("Mathematics ", ""), averageGrade: average };
  });
}

export function getSubmissionRate(): SubmissionRatePoint[] {
  return [
    { label: "Week 1", rate: 74 },
    { label: "Week 2", rate: 82 },
    { label: "Week 3", rate: 77 },
    { label: "This week", rate: 90 },
  ];
}

/* ---------------- gradebook (T11) ---------------- */

export function getAssignmentsForClassGrid(classId: string): TeacherAssignment[] {
  return getAssignmentsForTeacher()
    .filter((assignment) => assignment.status !== "draft")
    .filter(
      (assignment) =>
        (assignment.targetType === "class" && assignment.targetId === classId) ||
        (assignment.targetType === "student" &&
          (getStudentById(assignment.targetId)?.classId ?? null) === classId),
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function getGradebookForClass(classId: string): GradebookForClass {
  const columns = getAssignmentsForClassGrid(classId).map((assignment) => ({
    assignmentId: assignment.id,
    title: assignment.title,
    dueDate: assignment.dueDate,
    maxGrade: assignment.maxGrade,
  }));

  const rows: GradebookRow[] = getClassRoster(classId).map((student) => {
    const cells: GradebookCell[] = columns.map((column) => {
      const submission = getSubmissionsForAssignment(column.assignmentId).find(
        (row) => row.studentId === student.id,
      );
      return {
        assignmentId: column.assignmentId,
        studentId: student.id,
        value: submission?.grade ?? null,
        late: submission?.status === "late",
      };
    });
    const gradedValues = cells
      .map((cell) => cell.value)
      .filter((value): value is number => value !== null);
    const average = gradedValues.length
      ? Math.round(gradedValues.reduce((sum, value) => sum + value, 0) / gradedValues.length)
      : null;
    return { studentId: student.id, studentName: student.name, cells, average };
  });

  const columnAverages = columns.map((column) => {
    const values = rows
      .map((row) => row.cells.find((cell) => cell.assignmentId === column.assignmentId)?.value)
      .filter((value): value is number => typeof value === "number");
    return {
      assignmentId: column.assignmentId,
      average: values.length
        ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
        : null,
    };
  });

  return { classId, columns, rows, columnAverages };
}

/* ---------------- class attendance grid (T5) ---------------- */

export function getClassAttendanceGrid(
  classId: string,
): { dates: string[]; rows: { studentId: string; name: string; statuses: (string | null)[] }[] } {
  const records = getAttendanceRecordsForTeacher().filter((record) => record.classId === classId);
  const dates = records.map((record) => record.date).sort();
  const rows = getClassRoster(classId).map((student) => ({
    studentId: student.id,
    name: student.name,
    statuses: dates.map((date) => {
      const record = records.find((row) => row.date === date);
      const entry = record?.entries.find((entry) => entry.studentId === student.id);
      return entry ? entry.status : null;
    }),
  }));
  return { dates, rows };
}

/* ---------------- attendance summary (T3) ---------------- */

export function getStudentAttendanceForMonth(
  studentId: string,
): { date: string; status: "present" | "absent" | "late" | "excused" | null }[] {
  const result: { date: string; status: "present" | "absent" | "late" | "excused" | null }[] = [];
  const seed = studentId.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  for (let day = 1; day <= 28; day += 1) {
    const date = new Date();
    date.setDate(day);
    if (date.getDay() === 0) continue; // Sunday off
    const roll = (seed + day * 13) % 7;
    const status = roll === 0 ? "absent" : roll === 1 ? "late" : roll === 6 ? "excused" : "present";
    result.push({ date: date.toISOString().slice(0, 10), status });
  }
  return result;
}
