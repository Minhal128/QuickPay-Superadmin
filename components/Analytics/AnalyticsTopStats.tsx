"use client";

import React from "react";
import { useApi } from "@/lib/useApi";

type Stat = {
  title: string;
  value: string;
  growth: string;
};

const AnalyticsTopStats = () => {
  const { data } = useApi<{ stats: Stat[] }>("/analytics/overview");
  const statsData = data?.stats ?? [];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 p-4 bg-[#121212] xl:grid-cols-4 gap-3">
        {statsData.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-[#1f1f1f] bg-[#1A1A1A] p-3 shadow-sm"
          >
            <div className="space-y-5">
              <h3 className="text-sm md:text-md font-Inter text-[#d4d4d4]">
                {item.title}
              </h3>

              <div className="rounded-xl bg-[#121212] p-4">
                <h2 className="text-xl md:text-3xl font-Inter text-white">
                  {item.value}
                </h2>

                <div className="mt-2 flex items-center font-Inter gap-1 text-xs text-[#7A7A7A]">
                  <span>{item.growth}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsTopStats;
