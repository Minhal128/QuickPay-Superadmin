"use client";

import { useApi } from "@/lib/useApi";

type PreferenceItem = {
  label: string;
  percentage: number;
};

const COLORS = [
  "bg-violet-500",
  "bg-white",
  "bg-emerald-400",
  "bg-amber-500",
  "bg-gray-200",
];

export default function Preferences() {
  const { data } = useApi<{ preferences: PreferenceItem[] }>("/crm/overview");
  const preferences = data?.preferences ?? [];

  return (
    <div className="bg-[#121212] px-4 pb-4 md:pb-4 rounded-bl-2xl rounded-br-2xl">
      <div className="w-full rounded-2xl border border-[#1f1f24] bg-[#1A1A1A] p-4">
        <h2 className="mb-6 text-md font-Inter text-white">
          Favorites & Preferences
        </h2>

        <div className="bg-[#121212] p-3 rounded-lg">
          <div className="space-y-5">
            {preferences.map((item, index) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-Inter text-gray-200 md:text-sm">
                    {item.label}
                  </span>

                  <span className="text-xs font-Inter text-gray-400 sm:text-sm">
                    {item.percentage}%
                  </span>
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
                  <div
                    className={`h-full ${COLORS[index % COLORS.length]} transition-all duration-500`}
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
