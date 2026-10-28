import { MOCK_PARENT, getLinkedChildren } from "@/app/parent/mock/data";

export interface LinkedChildProfileEntry {
  childId: string;
  childName: string;
  relationship: string;
  linkDate: string;
}

export interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export const mockParentProfileData: {
  profiles: { name: string; email: string; phone: string };
  children: LinkedChildProfileEntry[];
  preferences: NotificationPreference[];
} = {
  profiles: {
    name: MOCK_PARENT.name,
    email: MOCK_PARENT.email,
    phone: MOCK_PARENT.phone,
  },
  children: getLinkedChildren().map((child) => ({
    childId: child.id,
    childName: child.name,
    relationship: child.relationship,
    linkDate: child.linkDate,
  })),
  preferences: [
    {
      id: "grades",
      title: "Grades posted",
      description: "Whenever a teacher posts a new grade",
      enabled: true,
    },
    {
      id: "attendance",
      title: "Attendance alerts",
      description: "Same-day alert for absences and lates",
      enabled: true,
    },
    {
      id: "invoices",
      title: "New invoices & overdue reminders",
      description: "Invoice issued, due soon, overdue",
      enabled: true,
    },
    {
      id: "meetings",
      title: "Meeting updates",
      description: "Confirmations, reschedules, declines",
      enabled: true,
    },
  ],
};
