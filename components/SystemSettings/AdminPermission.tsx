"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  enabled: boolean;
}

export default function AdminPermission() {
  const { data } = useApi<{ items: NotificationItem[] }>(
    "/settings/permissions",
  );
  const [editedNotifications, setNotifications] = useState<NotificationItem[] | null>(null);
  const notifications = editedNotifications ?? data?.items ?? [];

  const toggleNotification = async (id: number) => {
    const next = notifications.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item,
    );
    setNotifications(next);
    try {
      await api("/settings/permissions", {
        method: "PATCH",
        body: JSON.stringify({ items: next }),
      });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="w-full bg-[#121212] px-4 pb-4">
      <div className="rounded-2xl border border-white/5 bg-[#121212] p-4 sm:p-5 lg:p-6">
        <h2 className="mb-5 text-lg font-Inter text-white">Admin Permission</h2>

        <div className="space-y-2">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/20 px-4 py-4 transition-all duration-200"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-Inter text-white sm:text-base">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-[#6B7280] font-Inter sm:text-sm">
                  {item.description}
                </p>
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggleNotification(item.id)}
                className={`relative h-6 w-10 shrink-0 rounded-full cursor-pointer transition-all duration-300 ${
                  item.enabled ? "bg-white" : "bg-[#2A2A2A]"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full cursor-pointer transition-all duration-300 ${
                    item.enabled ? "right-1 bg-black" : "left-1 bg-white"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
