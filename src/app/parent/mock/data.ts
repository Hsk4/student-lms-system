import type {
  ChildAttendanceSummary,
  ChildAssignment,
  GradeItem,
  HomeAlert,
  Invoice,
  LinkedChild,
  MeetingRequest,
  ParentNotification,
  ParentProfile,
  PastMeeting,
  TeacherFeedback,
  UpcomingEvent,
  UpcomingMeeting,
} from "@/app/parent/mock/types";

import { dateIn, daysAgoDate } from "@/app/parent/mock/date-utils";

export const SIMULATE_SINGLE_CHILD_LINKED = false;

export const MOCK_PARENT: ParentProfile = {
  id: "par-001",
  name: "Kavita Sharma",
  email: "kavita.sharma@example.com",
  phone: "+91 98100 22334",
  relationship: "mother",
};

const ADDRESS: LinkedChild[] = [
  {
    id: "stu-1024",
    name: "Aditi Sharma",
    email: "aditi.sharma@school.edu",
    board: "CBSE Board",
    level: "Grade 9",
    relationship: "Daughter",
    linkDate: "2026-04-12",
    status: "active",
    subjects: [
      { id: "sub-1", subject: "Mathematics", teacherId: "tch-1", teacherName: "Rohit Verma" },
      { id: "sub-2", subject: "Science", teacherId: "tch-2", teacherName: "Sana Iqbal" },
      { id: "sub-3", subject: "English", teacherId: "tch-3", teacherName: "Farah Khan" },
    ],
    teachers: [
      { id: "tch-1", name: "Rohit Verma", subject: "Mathematics", sessionType: "class", schedule: "Mon & Wed, 5:00 PM" },
      { id: "tch-2", name: "Sana Iqbal", subject: "Science", sessionType: "one-on-one", schedule: "Tue, 4:30 PM" },
      { id: "tch-3", name: "Farah Khan", subject: "English", sessionType: "class", schedule: "Fri, 6:00 PM" },
    ],
    attendancePercent: 94,
    averageGradePercent: 86,
    assignmentsDueThisWeek: 3,
  },
  {
    id: "stu-1025",
    name: "Aarav Sharma",
    email: "aarav.sharma@school.edu",
    board: "CBSE Board",
    level: "Grade 6",
    relationship: "Son",
    linkDate: "2026-04-12",
    status: "active",
    subjects: [
      { id: "sub-4", subject: "Mathematics", teacherId: "tch-4", teacherName: "Neha Gupta" },
      { id: "sub-5", subject: "Urdu", teacherId: "tch-5", teacherName: "Imran Ali" },
    ],
    teachers: [
      { id: "tch-4", name: "Neha Gupta", subject: "Mathematics", sessionType: "class", schedule: "Sat & Sun, 10:00 AM" },
      { id: "tch-5", name: "Imran Ali", subject: "Urdu", sessionType: "one-on-one", schedule: "Thu, 5:00 PM" },
    ],
    attendancePercent: 88,
    averageGradePercent: 72,
    assignmentsDueThisWeek: 1,
  },
  {
    id: "stu-1026",
    name: "Zoya Sharma",
    email: "zoya.sharma@school.edu",
    board: "ICSE Board",
    level: "Grade 3",
    relationship: "Daughter",
    linkDate: "2026-08-30",
    status: "awaiting_teacher",
    subjects: [],
    teachers: [],
    attendancePercent: 0,
    averageGradePercent: 0,
    assignmentsDueThisWeek: 0,
  },
];

export function getLinkedChildren(): LinkedChild[] {
  return SIMULATE_SINGLE_CHILD_LINKED ? ADDRESS.slice(0, 1) : ADDRESS;
}

export function getChildById(childId: string): LinkedChild | undefined {
  return getLinkedChildren().find((child) => child.id === childId);
}

export function childNameById(childId: string): string {
  return getChildById(childId)?.name ?? "Unknown";
}

const GRADES: GradeItem[] = [
  { id: "grd-1", childId: "stu-1024", subject: "Mathematics", teacherName: "Rohit Verma", title: "Quadratics unit test", type: "Test", score: 18, max: 20, date: daysAgoDate(6), comment: "Strong work on factorising. Watch the sign errors." },
  { id: "grd-2", childId: "stu-1024", subject: "Science", teacherName: "Sana Iqbal", title: "Periodic trends test", type: "Test", score: 21, max: 25, date: daysAgoDate(10), comment: "Good recall, diagram labelling needs practice." },
  { id: "grd-3", childId: "stu-1024", subject: "English", teacherName: "Farah Khan", title: "Essay: My city", type: "Assignment", score: 13, max: 15, date: daysAgoDate(14) },
  { id: "grd-4", childId: "stu-1024", subject: "Mathematics", teacherName: "Rohit Verma", title: "Factorising assignment", type: "Assignment", score: 14, max: 15, date: daysAgoDate(22) },
  { id: "grd-5", childId: "stu-1024", subject: "Science", teacherName: "Sana Iqbal", title: "Lab report: reactivity", type: "Assignment", score: 12, max: 15, date: daysAgoDate(26) },
  { id: "grd-6", childId: "stu-1025", subject: "Mathematics", teacherName: "Neha Gupta", title: "Fractions quiz", type: "Quiz", score: 7, max: 10, date: daysAgoDate(4), comment: "Improving, revisit word problems." },
  { id: "grd-7", childId: "stu-1025", subject: "Urdu", teacherName: "Imran Ali", title: "Reading comprehension", type: "Assignment", score: 14, max: 20, date: daysAgoDate(12) },
  { id: "grd-8", childId: "stu-1025", subject: "Mathematics", teacherName: "Neha Gupta", title: "Geometry worksheet", type: "Assignment", score: 9, max: 10, date: daysAgoDate(19) },
];

export function getGradesForChild(childId: string): GradeItem[] {
  if (childId === "all") return GRADES;
  return GRADES.filter((grade) => grade.childId === childId);
}

const ASSIGNMENTS: ChildAssignment[] = [
  { id: "asg-1", childId: "stu-1024", title: "Triangles problem set", subject: "Mathematics", dueDate: dateIn(1, 23, 59), status: "due" },
  { id: "asg-2", childId: "stu-1024", title: "Chemistry: acids and bases", subject: "Science", dueDate: dateIn(3, 23, 59), status: "due" },
  { id: "asg-3", childId: "stu-1024", title: "Macbeth Act II summary", subject: "English", dueDate: dateIn(5, 23, 59), status: "due" },
  { id: "asg-4", childId: "stu-1024", title: "Factorising assignment", subject: "Mathematics", dueDate: dateIn(-2), status: "graded", score: 14, max: 15, feedback: "Excellent, small slip in question 4.", feedbackDate: dateIn(-1) },
  { id: "asg-5", childId: "stu-1024", title: "Physics: motion graphs", subject: "Science", dueDate: dateIn(-6), status: "submitted" },
  { id: "asg-6", childId: "stu-1024", title: "Poem annotation", subject: "English", dueDate: dateIn(-9), status: "missing" },
  { id: "asg-7", childId: "stu-1025", title: "Fractions practice", subject: "Mathematics", dueDate: dateIn(2, 22, 0), status: "graded", score: 7, max: 10, feedback: "Word problems need another pass.", feedbackDate: dateIn(-1) },
  { id: "asg-8", childId: "stu-1025", title: "Urdu essay draft", subject: "Urdu", dueDate: dateIn(4, 22, 0), status: "due" },
  { id: "asg-9", childId: "stu-1025", title: "Geometry worksheet", subject: "Mathematics", dueDate: dateIn(-8), status: "graded", score: 9, max: 10 },
];

export function getAssignmentsForChild(childId: string): ChildAssignment[] {
  if (childId === "all") return ASSIGNMENTS;
  return ASSIGNMENTS.filter((assignment) => assignment.childId === childId);
}

export function feeTotalsFor(invoices: Invoice[]): {
  outstanding: number;
  paidThisTerm: number;
  nextDueDate: string | null;
} {
  const outstanding = invoices
    .filter((invoice) => invoice.status !== "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidThisTerm = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const nextDue = invoices
    .filter((invoice) => invoice.status !== "paid")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  return { outstanding, paidThisTerm, nextDueDate: nextDue ? nextDue.dueDate : null };
}

const INVOICES: Invoice[] = [
  {
    id: "inv-1041", number: "INV-1041", childId: "stu-1024", childName: "Aditi Sharma",
    period: "October 2026", amount: 12000, issueDate: dateIn(-20), dueDate: dateIn(3),
    status: "due",
    lineItems: [
      { label: "Mathematics tuition (4 sessions)", amount: 6000 },
      { label: "Science one-on-one (4 sessions)", amount: 4500 },
      { label: "English tuition (4 sessions)", amount: 1500 },
    ],
  },
  {
    id: "inv-1042", number: "INV-1042", childId: "stu-1025", childName: "Aarav Sharma",
    period: "October 2026", amount: 8000, issueDate: dateIn(-20), dueDate: dateIn(3),
    status: "due",
    lineItems: [
      { label: "Mathematics tuition (8 sessions)", amount: 6000 },
      { label: "Urdu one-on-one (4 sessions)", amount: 2000 },
    ],
  },
  {
    id: "inv-1033", number: "INV-1033", childId: "stu-1024", childName: "Aditi Sharma",
    period: "September 2026", amount: 12000, issueDate: dateIn(-50), dueDate: dateIn(-20),
    status: "paid", paidOn: dateIn(-18),
    lineItems: [
      { label: "Mathematics tuition (4 sessions)", amount: 6000 },
      { label: "Science one-on-one (4 sessions)", amount: 4500 },
      { label: "English tuition (4 sessions)", amount: 1500 },
    ],
  },
  {
    id: "inv-1028", number: "INV-1028", childId: "stu-1025", childName: "Aarav Sharma",
    period: "September 2026", amount: 8000, issueDate: dateIn(-50), dueDate: dateIn(-25),
    status: "overdue",
    lineItems: [
      { label: "Mathematics tuition (8 sessions)", amount: 6000 },
      { label: "Urdu one-on-one (4 sessions)", amount: 2000 },
    ],
  },
];

export function getInvoicesForChild(childId: string): Invoice[] {
  if (childId === "all") return INVOICES;
  return INVOICES.filter((invoice) => invoice.childId === childId);
}

const UPCOMING_MEETINGS: UpcomingMeeting[] = [
  {
    id: "mtg-1", childId: "stu-1024", childName: "Aditi Sharma", teacherName: "Rohit Verma",
    topic: "Board exam readiness review", scheduledAt: dateIn(4, 17, 30),
    location: "Online session", joinLink: "https://meet.school.edu/aditi-rv",
  },
];

const MEETING_REQUESTS: MeetingRequest[] = [
  {
    id: "req-1", childId: "stu-1025", childName: "Aarav Sharma", teacherName: "Neha Gupta",
    topic: "Progress discussion", requestedFor: dateIn(6, 11, 0), status: "pending", notes: "Before the term test week, please.",
  },
  {
    id: "req-2", childId: "stu-1024", childName: "Aditi Sharma", teacherName: "Sana Iqbal",
    topic: "Science project guidance", requestedFor: dateIn(2, 16, 0), status: "rescheduled",
    proposedTime: dateIn(8, 18, 0),
  },
  {
    id: "req-3", childId: "stu-1026", childName: "Zoya Sharma", teacherName: "Unassigned",
    topic: "New enrollment orientation", requestedFor: dateIn(1, 10, 0), status: "declined",
  },
];

export function getMeetingRequestsForChild(childId: string): MeetingRequest[] {
  if (childId === "all") return MEETING_REQUESTS;
  return MEETING_REQUESTS.filter((request) => request.childId === childId);
}

export function getUpcomingMeetingsForChild(childId: string): UpcomingMeeting[] {
  if (childId === "all") return UPCOMING_MEETINGS;
  return UPCOMING_MEETINGS.filter((meeting) => meeting.childId === childId);
}

const PAST_MEETINGS: PastMeeting[] = [
  {
    id: "mtg-11", childId: "stu-1024", childName: "Aditi Sharma", teacherName: "Farah Khan",
    topic: "Essay writing feedback", heldAt: dateIn(-12, 17, 0),
    notes: "Aditi's structure is improving. Suggested reading list shared.",
  },
  {
    id: "mtg-12", childId: "stu-1025", childName: "Aarav Sharma", teacherName: "Imran Ali",
    topic: "Reading level check-in", heldAt: dateIn(-30, 17, 0),
  },
];

export function getPastMeetingsForChild(childId: string): PastMeeting[] {
  if (childId === "all") return PAST_MEETINGS;
  return PAST_MEETINGS.filter((meeting) => meeting.childId === childId);
}

const TEACHER_FEEDBACK: TeacherFeedback[] = [
  { id: "fb-1", childId: "stu-1024", teacherName: "Rohit Verma", subject: "Mathematics", date: dateIn(-5), excerpt: "Consistent effort this month. Extra practice on trigonometry will lift test scores further." },
  { id: "fb-2", childId: "stu-1024", teacherName: "Sana Iqbal", subject: "Science", date: dateIn(-9), excerpt: "Curious and engaged in labs. Practical write-ups are improving each week." },
  { id: "fb-3", childId: "stu-1024", teacherName: "Farah Khan", subject: "English", date: dateIn(-14), excerpt: "Vocabulary is growing steadily. Encourage reading for 20 minutes nightly." },
];

export function getTeacherFeedbackForChild(childId: string): TeacherFeedback[] {
  if (childId === "all") return TEACHER_FEEDBACK;
  return TEACHER_FEEDBACK.filter((item) => item.childId === childId);
}

export interface GradeTrendPoint {
  date: string;
  percent: number;
}

export function getGradeTrendForChild(childId: string): GradeTrendPoint[] {
  if (childId === "stu-1026") return [];
  const base = childId === "stu-1025" ? 62 : 74;
  const spread = childId === "stu-1025" ? 18 : 16;
  return Array.from({ length: 10 }, (_, index) => ({
    date: daysAgoDate(45 - index * 4),
    percent: base + ((index * 7) % spread),
  }));
}

export function getGradePointsBySubjectForChild(childId: string): {
  subject: string;
  teacherName: string;
  average: number;
  trend: number[];
  items: GradeItem[];
}[] {
  const grades = getGradesForChild(childId);
  const grouped = new Map<string, GradeItem[]>();

  grades.forEach((grade) => {
    const existing = grouped.get(grade.subject) ?? [];
    existing.push(grade);
    grouped.set(grade.subject, existing);
  });

  return Array.from(grouped.entries()).map(([subject, items]) => {
    const totalScore = items.reduce((sum, item) => sum + item.score, 0);
    const totalMax = items.reduce((sum, item) => sum + item.max, 0);
    const spark = items
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((item) => Math.round((item.score / item.max) * 100));

    return {
      subject,
      teacherName: items[0].teacherName,
      average: Math.round((totalScore / totalMax) * 100),
      trend: spark,
      items: items.slice().sort((a, b) => b.date.localeCompare(a.date)),
    };
  });
}

export function getUpcomingEventsForChild(childId: string): UpcomingEvent[] {
  const events: UpcomingEvent[] = [
    { id: "ev-1", type: "assignment", title: "Triangles problem set due", childId: "stu-1024", someTime: "23:59", date: dateIn(1, 23, 59) },
    { id: "ev-2", type: "session", title: "Mathematics class", childId: "stu-1024", someTime: "17:00", date: dateIn(1, 17, 0) },
    { id: "ev-3", type: "session", title: "Science one-on-one", childId: "stu-1024", someTime: "16:30", date: dateIn(2, 16, 30) },
    { id: "ev-4", type: "meeting", title: "Board exam readiness review", childId: "stu-1024", someTime: "17:30", date: dateIn(4, 17, 30) },
    { id: "ev-5", type: "invoice", title: "Invoice INV-1041 due", childId: "stu-1024", someTime: "17:00", date: dateIn(3, 17, 0) },
    { id: "ev-6", type: "assignment", title: "Fractions practice due", childId: "stu-1025", someTime: "22:00", date: dateIn(2, 22, 0) },
    { id: "ev-7", type: "session", title: "Urdu one-on-one", childId: "stu-1025", someTime: "17:00", date: dateIn(3, 17, 0) },
    { id: "ev-8", type: "invoice", title: "Invoice INV-1042 due", childId: "stu-1025", someTime: "17:00", date: dateIn(3, 17, 0) },
  ];

  return events
    .filter((event) => childId === "all" || event.childId === childId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getHomeAlertsForChild(childId: string): HomeAlert[] {
  const alerts: HomeAlert[] = [
    { id: "al-1", severity: "critical", message: "Invoice INV-1028 for Aarav is overdue", childId: "stu-1025", href: "/parent/fees" },
    { id: "al-2", severity: "warning", message: "Aarav's attendance dropped below 90%", childId: "stu-1025", href: "/parent/children/stu-1025" },
    { id: "al-3", severity: "warning", message: "Poem annotation is missing for Aditi", childId: "stu-1024", href: "/parent/children/stu-1024" },
    { id: "al-4", severity: "info", message: "New feedback from Rohit Verma on Aditi's test", childId: "stu-1024", href: "/parent/children/stu-1024" },
  ];

  if (childId === "all") return alerts;
  return alerts.filter((alert) => alert.childId === childId);
}

const NOTIFICATIONS: ParentNotification[] = [
  { id: "not-1", kind: "grade", text: "Grade posted: Mathematics test 18/20", childId: "stu-1024", childName: "Aditi Sharma", occurredAt: dateIn(0, 9, 15), read: false, href: "/parent/children/stu-1024" },
  { id: "not-2", kind: "meeting", text: "Sana Iqbal proposed a new meeting time", childId: "stu-1024", childName: "Aditi Sharma", occurredAt: dateIn(0, 8, 40), read: false, href: "/parent/meetings" },
  { id: "not-3", kind: "attendance", text: "Aarav was marked late in Urdu", childId: "stu-1025", childName: "Aarav Sharma", occurredAt: dateIn(0, 7, 20), read: false, href: "/parent/children/stu-1025" },
  { id: "not-4", kind: "invoice", text: "Invoice INV-1028 is overdue", childId: "stu-1025", childName: "Aarav Sharma", occurredAt: dateIn(-1, 18, 5), read: true, href: "/parent/fees" },
  { id: "not-5", kind: "invoice", text: "Invoice INV-1041 issued, due in 3 days", childId: "stu-1024", childName: "Aditi Sharma", occurredAt: dateIn(-1, 11, 0), read: true, href: "/parent/fees" },
  { id: "not-6", kind: "grade", text: "Grade posted: Urdu comprehension 14/20", childId: "stu-1025", childName: "Aarav Sharma", occurredAt: dateIn(-2, 15, 30), read: true, href: "/parent/children/stu-1025" },
  { id: "not-7", kind: "meeting", text: "Meeting confirmed with Rohit Verma", childId: "stu-1024", childName: "Aditi Sharma", occurredAt: dateIn(-3, 10, 10), read: true, href: "/parent/meetings" },
];

export function getNotificationsForChild(childId: string): ParentNotification[] {
  if (childId === "all") return NOTIFICATIONS;
  return NOTIFICATIONS.filter((item) => item.childId === childId);
}

export function getAttendanceSummaryForChild(childId: string): ChildAttendanceSummary {
  if (childId === "stu-1024") return { childId, present: 58, absent: 3, late: 2, excused: 1 };
  if (childId === "stu-1025") return { childId, present: 49, absent: 4, late: 5, excused: 2 };
  return { childId, present: 0, absent: 0, late: 0, excused: 0 };
}
