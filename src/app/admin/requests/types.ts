import { daysAgo } from "@/lib/date";
import type { UserRole } from "@/types/user";

export type RequestStatus = "pending" | "approved" | "rejected";

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  requestedRole: UserRole;
  status: RequestStatus;
  requestedAt: string;
  department: string;
  note: string;
}

export const REQUEST_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const REQUEST_DATE_OPTIONS: { label: string; value: string }[] = [
  { label: "All dates", value: "all" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "quarter" },
];

export const MOCK_REQUESTS: AccessRequest[] = [
  {
    id: "REQ-1041",
    name: "Rohan Verma",
    email: "rohan.verma@student.school.edu",
    requestedRole: "student",
    status: "pending",
    requestedAt: daysAgo(1),
    department: "Grade 10 - A",
    note: "Transfer from Delhi Public School",
  },
  {
    id: "REQ-1042",
    name: "Ananya Iyer",
    email: "ananya.iyer@teacher.school.edu",
    requestedRole: "teacher",
    status: "approved",
    requestedAt: daysAgo(3),
    department: "Mathematics",
    note: "Joining as Physics teacher",
  },
  {
    id: "REQ-1043",
    name: "Suresh Menon",
    email: "suresh.menon@parent.school.edu",
    requestedRole: "parent",
    status: "pending",
    requestedAt: daysAgo(5),
    department: "Grade 8 - C",
    note: "Guardian of Aditya Menon",
  },
  {
    id: "REQ-1044",
    name: "Priya Nair",
    email: "priya.nair@teacher.school.edu",
    requestedRole: "teacher",
    status: "rejected",
    requestedAt: daysAgo(7),
    department: "Chemistry",
    note: "Documents pending verification",
  },
  {
    id: "REQ-1045",
    name: "Karthik Subramanian",
    email: "karthik.s@student.school.edu",
    requestedRole: "student",
    status: "approved",
    requestedAt: daysAgo(10),
    department: "Grade 12 - B",
    note: "NDA signed",
  },
  {
    id: "REQ-1046",
    name: "Farhan Qureshi",
    email: "farhan.q@teacher.school.edu",
    requestedRole: "teacher",
    status: "pending",
    requestedAt: daysAgo(12),
    department: "Physical Education",
    note: "Referred by sports department",
  },
  {
    id: "REQ-1047",
    name: "Lakshmi Rao",
    email: "lakshmi.rao@parent.school.edu",
    requestedRole: "parent",
    status: "approved",
    requestedAt: daysAgo(15),
    department: "Grade 6 - A",
    note: "Fee structure requested",
  },
  {
    id: "REQ-1048",
    name: "Devansh Gupta",
    email: "devansh.gupta@student.school.edu",
    requestedRole: "student",
    status: "pending",
    requestedAt: daysAgo(18),
    department: "Grade 9 - C",
    note: "Scholarship application",
  },
  {
    id: "REQ-1049",
    name: "Nidhi Chatterjee",
    email: "nidhi.c@teacher.school.edu",
    requestedRole: "teacher",
    status: "approved",
    requestedAt: daysAgo(22),
    department: "English Literature",
    note: "Visiting faculty",
  },
  {
    id: "REQ-1050",
    name: "Sameer Joshi",
    email: "sameer.joshi@parent.school.edu",
    requestedRole: "parent",
    status: "rejected",
    requestedAt: daysAgo(26),
    department: "Grade 11 - A",
    note: "Duplicate request",
  },
  {
    id: "REQ-1051",
    name: "Ishita Bhardwaj",
    email: "ishita.b@student.school.edu",
    requestedRole: "student",
    status: "pending",
    requestedAt: daysAgo(31),
    department: "Grade 7 - B",
    note: "Sibling of existing student",
  },
  {
    id: "REQ-1052",
    name: "Zoya Khan",
    email: "zoya.khan@teacher.school.edu",
    requestedRole: "teacher",
    status: "approved",
    requestedAt: daysAgo(38),
    department: "History",
    note: "Part-time faculty",
  },
  {
    id: "REQ-1053",
    name: "Manish Agarwal",
    email: "manish.a@parent.school.edu",
    requestedRole: "parent",
    status: "pending",
    requestedAt: daysAgo(44),
    department: "Grade 4 - A",
    note: "New admission enquiry",
  },
  {
    id: "REQ-1054",
    name: "Tara Pillai",
    email: "tara.pillai@student.school.edu",
    requestedRole: "student",
    status: "approved",
    requestedAt: daysAgo(52),
    department: "Grade 11 - C",
    note: "Sports quota admission",
  },
  {
    id: "REQ-1055",
    name: "Arjun Desai",
    email: "arjun.desai@teacher.school.edu",
    requestedRole: "teacher",
    status: "pending",
    requestedAt: daysAgo(61),
    department: "Economics",
    note: "Background check completed",
  },
];
