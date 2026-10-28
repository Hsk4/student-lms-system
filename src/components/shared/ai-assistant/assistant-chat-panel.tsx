"use client";

import * as React from "react";
import { Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "student" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "seed-1",
    role: "assistant",
    content:
      "Hi Aditi! I am your study assistant. Ask me about your classes, assignments, fees or anything you need help with.",
  },
];

export const SUGGESTED_QUESTIONS: string[] = [
  "What assignments are due this week?",
  "Summarise my last Physics class",
  "How much fees do I owe?",
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockAssistantResponse(prompt: string, turn: number): string {
  if (/\b(assign|due|homework)\b/.test(prompt)) {
    return "You have 2 assignments due this week. Physics 'Kinematics worksheet' is due Thu 23rd and Mathematics 'Quadratics practice set' is due Sat 25th.";
  }
  if (/\b(fee|invoice|pay|owe)\b/.test(prompt)) {
    return "Your outstanding balance is Rs 24,000. The next invoice of Rs 12,000 is due Fri 31st.";
  }
  if (/\b(class|lesson|physics|math|note)\b/.test(prompt)) {
    return "Last week's Physics class covered kinematics graphs. I can pull the teacher's notes and the worksheet PDF for you.";
  }
  const canned = [
    "Good question! This is a canned demo response, the real AI will be connected later behind this exact function.",
    "I can help with timetables, assignments, fees and course material. Try asking about one of those.",
    "Nothing is stored anywhere in this demo, UI state only.",
  ];
  return canned[turn % canned.length];
}

export async function sendMessage(
  history: ChatMessage[],
): Promise<string> {
  await delay(900);
  const prompt = history
    .filter((message) => message.role === "student")
    .map((message) => message.content)
    .join(" ")
    .toLowerCase();
  return mockAssistantResponse(prompt, history.length);
}

interface AssistantChatPanelProps {
  className?: string;
  bodyClassName?: string;
}

export function AssistantChatPanel({
  className,
  bodyClassName,
}: AssistantChatPanelProps) {
  const [messages, setMessages] =
    React.useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, isTyping]);

  const submitMessage = async () => {
    const content = input.trim();
    if (!content || isTyping) return;

    const studentMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "student",
      content,
    };
    const nextHistory = [...messages, studentMessage];
    setMessages(nextHistory);
    setInput("");
    setIsTyping(true);

    const reply = await sendMessage(nextHistory);
    setMessages((current) => [
      ...current,
      {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: reply,
      },
    ]);
    setIsTyping(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div
        ref={scrollRef}
        className={cn(
          "flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5",
          bodyClassName ?? "max-h-[60vh] min-h-[400px]",
        )}
      >
        {messages.map((message) => {
          const isStudent = message.role === "student";
          return (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                isStudent ? "justify-end" : "justify-start",
              )}
            >
              {!isStudent ? (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Sparkles className="h-4 w-4" />
                </span>
              ) : null}
              <div
                className={cn(
                  "max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  isStudent
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-secondary text-secondary-foreground",
                )}
              >
                {message.content}
              </div>
            </div>
          );
        })}

        {isTyping ? (
          <div className="flex items-end gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span
              className="flex gap-1 rounded-2xl rounded-bl-md bg-secondary px-4 py-3"
              aria-label="Assistant is typing"
            >
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70" />
            </span>
          </div>
        ) : null}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => setInput(question)}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {question}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the assistant anything..."
            className="min-h-[46px] resize-none"
            aria-label="Message to assistant"
          />
          <Button
            type="button"
            onClick={() => void submitMessage()}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            <Send />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
