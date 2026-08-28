"use client";

import React from "react";
import { IoIosDocument } from "react-icons/io";
import { useApi } from "@/lib/useApi";

interface Activity {
  id: number;
  title: string;
  time: string;
}

const RecentActivity = () => {
  const { data } = useApi<{ activities: Activity[] }>("/dashboard/overview");
  const activities = data?.activities ?? [];

  return (
    <div className="md:pl-3 px-4 pb-4 bg-[#121212] rounded-br-2xl">
      <div className="w-full rounded-2xl bg-[#1A1A1A] p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-Inter text-white md:text-lg">
            Recent Activities
          </h2>

          <button className="text-xs md:text-xs font-Inter cursor-pointer text-cyan-400 transition hover:text-cyan-300">
            See All
          </button>
        </div>

        {/* Activity */}
        <div className="mt-2">
          {activities.map((activity) => (
            <div key={activity.id}>
              <div className="flex items-start gap-3 py-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
                  <IoIosDocument className="h-4 w-4 text-gray-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xm md:text-sm font-Inter text-gray-200">
                    {activity.title}
                  </h3>

                  <p className="mt-1 text-xs md:text-sm text-gray-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
