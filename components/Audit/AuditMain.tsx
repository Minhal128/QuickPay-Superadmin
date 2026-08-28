"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { format } from "date-fns";
import AuditLogDetail from "./AuditLogDetail";
import { useApi } from "@/lib/useApi";

interface AuditLog {
  id: number;
  title: string;
  subtitle: string;
  date: string;
}

export default function AuditMain() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Super admin");
  const [selectedAction, setSelectedAction] = useState("All action");
  const [roleOpen, setRoleOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const roles = ["Super admin", "Admin", "Moderator"];
  const actions = ["All action", "KYC", "Campaign", "Transaction", "Refund"];

  const [isOpen, setIsOpen] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedRole) params.set("role", selectedRole);
    if (selectedAction) params.set("action", selectedAction);
    const qs = params.toString();
    return qs ? `/audit?${qs}` : "/audit";
  }, [search, selectedRole, selectedAction]);

  const { data } = useApi<{ items: AuditLog[] }>(query);
  let filteredLogs = data?.items ?? [];
  if (selectedDate) {
    filteredLogs = filteredLogs.filter((log) =>
      String(log.date).startsWith(selectedDate),
    );
  }

  return (
    <div className="bg-[#121212] p-4 rounded-bl-2xl rounded-br-2xl">
      <div className="w-full overflow-hidden rounded-2xl border border-[#151515] bg-[#121212] text-white">
        <div className="border-b border-[#111111] p-2">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              <div className="relative w-full lg:w-65">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="text"
                  placeholder="Search logs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-lg font-Inter border border-[#1A1A1A] bg-[#171717] pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-700"
                />
              </div>

              {/* Role */}
              <div className="relative">
                <button
                  onClick={() => {
                    setRoleOpen(!roleOpen);
                    setActionOpen(false);
                  }}
                  className="flex h-11 min-w-40 cursor-pointer items-center font-Inter justify-between rounded-lg border border-[#1A1A1A] bg-[#171717] px-4 text-sm text-white"
                >
                  <span>{selectedRole}</span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      roleOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {roleOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-[#1A1A1A] bg-[#171717] shadow-2xl">
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setSelectedRole(role);
                          setRoleOpen(false);
                        }}
                        className={`flex w-full items-center font-Inter cursor-pointer justify-between px-4 py-3 text-left text-sm transition ${
                          selectedRole === role
                            ? "bg-white text-black"
                            : "text-white hover:bg-[#171717]"
                        }`}
                      >
                        {role}

                        {selectedRole === role && <Check size={15} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="relative">
                <button
                  onClick={() => {
                    setActionOpen(!actionOpen);
                    setRoleOpen(false);
                  }}
                  className="flex h-11 min-w-40 items-center font-Inter cursor-pointer justify-between rounded-lg border border-[#1A1A1A] bg-[#171717] px-4 text-sm text-white"
                >
                  <span>{selectedAction}</span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      actionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {actionOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-[#1A1A1A] bg-[#171717] shadow-2xl">
                    {actions.map((action) => (
                      <button
                        key={action}
                        onClick={() => {
                          setSelectedAction(action);
                          setActionOpen(false);
                        }}
                        className={`flex w-full items-center font-Inter cursor-pointer justify-between px-4 py-3 text-left text-sm transition ${
                          selectedAction === action
                            ? "bg-white text-black"
                            : "text-white hover:bg-[#171717]"
                        }`}
                      >
                        {action}

                        {selectedAction === action && <Check size={15} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Picker */}
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-11 min-w-37.5 rounded-lg border cursor-pointer font-Inter border-[#1A1A1A] bg-[#171717] px-4 pr-10 text-sm text-white outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <button className="flex font-Inter h-11 items-center justify-center gap-2 rounded-lg cursor-pointer bg-white px-10 text-sm text-black transition hover:bg-zinc-200">
              Export
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="w-full">
          {filteredLogs.map((log) => {
            const dateObj = new Date(log.date);
            const dateLabel = Number.isNaN(dateObj.getTime())
              ? log.date
              : format(dateObj, "MMM dd, HH:mm");
            return (
              <div
                key={log.id}
                onClick={() => setIsOpen(true)}
                className="flex items-center cursor-pointer justify-between border-b border-[#111111] px-4 py-4 transition"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-[#0D0D0D]" />

                  <div className="min-w-0">
                    <h3 className="truncate md:text-sm text-xs font-Inter text-white">
                      {log.title}
                    </h3>

                    <p className="mt-1 text-xs font-Inter text-zinc-500">
                      {log.subtitle}
                    </p>
                  </div>
                </div>

                <div className="ml-4 shrink-0">
                  <p className="md:text-sm text-xs font-Inter text-zinc-400">
                    {dateLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Audit Log Detail Modal */}
        <AuditLogDetail isOpen={isOpen} onClose={() => setIsOpen(false)} />

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <div className="flex h-52 items-center justify-center text-sm text-zinc-500">
            No logs found
          </div>
        )}
      </div>
    </div>
  );
}
