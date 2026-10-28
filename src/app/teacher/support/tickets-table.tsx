"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SupportTicket } from "@/app/teacher/mock/types";
import { formatDateTime } from "@/lib/format";

interface TicketsListProps {
  rows: SupportTicket[];
}

export function TicketsList({ rows }: TicketsListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/60 hover:bg-secondary/60">
            <TableHead>Subject</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Last update</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((ticket) => (
            <TableRow key={ticket.id} className="cursor-pointer">
              <TableCell>
                <Link
                  href={`/teacher/support/${ticket.id}`}
                  className="block font-medium text-foreground hover:text-primary"
                >
                  <span className="flex items-center gap-2">
                    {ticket.subject}
                    {ticket.escalated ? (
                      <Badge variant="warning" className="px-1.5 py-0 text-[10px]">
                        Escalated
                      </Badge>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground sm:hidden">
                    {ticket.category}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                {ticket.category}
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDateTime(ticket.updatedAt)}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={ticket.status} />
              </TableCell>
              <TableCell>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
