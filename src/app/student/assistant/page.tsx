"use client";

import { AssistantChatPanel } from "@/components/shared/ai-assistant/assistant-chat-panel";

export default function AssistantPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          AI Assistant
        </h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about your classes, homework, fees or anything else.
        </p>
      </div>

      <AssistantChatPanel className="min-h-[70vh]" bodyClassName="flex-1 max-h-none" />
    </div>
  );
}
