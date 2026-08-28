"use client";

import React from "react";
import { useApi } from "@/lib/useApi";

interface CityData {
  city: string;
  bookings: number;
}

const CityByHeat = () => {
  const { data } = useApi<{ heat: CityData[] }>("/bookings");
  const cityData = data?.heat ?? [];
  const maxBookings = Math.max(1, ...cityData.map((item) => item.bookings));
  const colors = [
    "bg-gradient-to-r from-violet-600 to-indigo-500",
    "bg-white",
    "bg-red-500",
    "bg-blue-500",
  ];
  return (
    <div className="bg-[#121212] rounded-bl-2xl">
      <div className="w-full rounded-[20px] bg-[#080808] h-full p-4 md:p-4 min-h-137">
        <div className="flex items-center justify-between border-b border-white/5 pb-5">
          <h2 className="text-md font-Inter text-white">City by heat</h2>

          <button className="text-cyan-400 text-xs md:text-xs font-Inter cursor-pointer hover:text-cyan-300 transition-colors">
            See All
          </button>
        </div>

        {/* Cities */}
        <div className="mt-6 space-y-7">
          {cityData.map((item, index) => {
            const percentage = (item.bookings / maxBookings) * 100;

            return (
              <div key={index}>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h3 className="text-white text-sm md:text-sm font-Inter">
                    {item.city}
                  </h3>

                  <p className="text-gray-400 text-xs md:text-sm font-Inter whitespace-nowrap">
                    {item.bookings} bookings
                  </p>
                </div>

                <div className="h-2 md:h-2.5 w-full overflow-hidden bg-[#121212]">
                  <div
                    className={`${colors[index % colors.length]} h-full rounded-l-full transition-all duration-500`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CityByHeat;
