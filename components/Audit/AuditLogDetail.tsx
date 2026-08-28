"use client";

import { X } from "lucide-react";

interface AuditLogDetailProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditLogDetail({
  isOpen,
  onClose,
}: AuditLogDetailProps) {
  if (!isOpen) return null;

  const details = [
    { label: "Log ID", value: "AUD-00841" },
    { label: "Admin", value: "Super Admin" },
    {
      label: "Action Type",
      value: (
        <span className="px-3 py-1 text-xs rounded-full border border-blue-500 text-blue-400">
          Venue
        </span>
      ),
    },
    { label: "Target", value: "Amara Sule (U-001)" },
    { label: "IP Address", value: "197.210.84.12" },
    { label: "Timestamp", value: "May 20, 2024 · 14:32:08" },
    { label: "Session ID", value: "sess_8f2a9c1d..." },
  ];

  const linkedEntities = ["BK-0WTI", "Sammy", "Audit log"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-800 bg-[#090909] shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-5">
          <h2 className="text-md font-Inter text-white">Audit Log Detail</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 cursor-pointer transition hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-3">
          <div className="divide-y divide-neutral-800">
            {details.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 py-3 flex-row items-center justify-between"
              >
                <span className="text-sm font-Inter text-neutral-500">
                  {item.label}
                </span>
                <div className="text-xs font-Inter text-white text-left sm:text-right">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Linked Entities */}
          <div className="mt-0 pt-5">
            <h3 className="mb-5 text-md font-Inter text-white">
              Linked Entities
            </h3>

            <div className="flex flex-wrap gap-3">
              {linkedEntities.map((item) => (
                <button
                  key={item}
                  className="rounded-full border font-Inter border-neutral-700 bg-[#111111] px-5 py-2 text-xs text-white transition hover:border-neutral-500"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          <button
            onClick={onClose}
            className="h-12 rounded-lg border border-red-600 cursor-pointer text-red-500 font-Inter transition hover:bg-red-600/10"
          >
            Close
          </button>

          <button className="h-12 rounded-lg bg-white text-black cursor-pointer font-Inter transition hover:bg-neutral-200">
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
