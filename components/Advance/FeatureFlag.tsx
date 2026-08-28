"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

type FlagItem = {
  title: string;
  description: string;
  enabled: boolean;
};

const FeatureFlag = () => {
  const { data } = useApi<{ items: FlagItem[] }>("/advance/flags");
  const [editedFlags, setFlags] = useState<FlagItem[] | null>(null);
  const flags = editedFlags ?? data?.items ?? [];

  const toggleFlag = async (title: string) => {
    const next = flags.map((item) =>
      item.title === title ? { ...item, enabled: !item.enabled } : item,
    );
    setFlags(next);
    try {
      await api("/advance/flags", {
        method: "PATCH",
        body: JSON.stringify({ items: next }),
      });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="">
      <div className="mx-auto w-full max-w-3xl rounded-lg border border-white/5 bg-[#1A1A1A] p-4 sm:p-5 md:p-3 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
        <h2 className="mb-5 font-Inter text-white text-md">Feature Flags</h2>

        <div className="space-y-2">
          {flags.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-[#1212124a] px-3 py-3 transition-all duration-200 hover:border-white/10"
            >
              <div className="min-w-0 flex-1 pr-4">
                <h3 className="text-base font-Inter text-white sm:text-sm">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-gray-500 font-Inter sm:text-sm">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => toggleFlag(item.title)}
                className={`relative h-6 w-12 shrink-0 rounded-full transition-all duration-300 ${
                  item.enabled ? "bg-white" : "bg-gray-500"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full transition-all duration-300 ${
                    item.enabled
                      ? "left-7 bg-black"
                      : "left-1 bg-[#111111]"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureFlag;
