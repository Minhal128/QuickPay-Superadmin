"use client";

import { useMemo, useState } from "react";
import RuleEdit from "./RuleEdit";
import { useApi } from "@/lib/useApi";

type TabType = "All rules" | "Cancellation" | "Refund" | "Booking";

interface RuleCard {
  id: number;
  title: string;
  condition: string;
  action: string;
  active: boolean;
  category?: string;
}

const tabs: TabType[] = ["All rules", "Cancellation", "Refund", "Booking"];

export default function RulesMain() {
  const [activeTab, setActiveTab] = useState<TabType>("All rules");
  const [openModal, setOpenModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (activeTab !== "All rules") params.set("category", activeTab);
    if (refreshKey) params.set("_", String(refreshKey));
    const qs = params.toString();
    return qs ? `/rules?${qs}` : "/rules";
  }, [activeTab, refreshKey]);

  const { data } = useApi<{ items: RuleCard[] }>(query);
  const rulesData = data?.items ?? [];

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white p-4 sm:p-5 lg:p-6 rounded-bl-2xl rounded-br-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-10 px-4 rounded-lg text-sm font-Inter cursor-pointer transition-all duration-200 border
                ${
                  activeTab === tab
                    ? "bg-[#1A1A1A] border-[#9A9A9A] text-white"
                    : "bg-[#1A1A1A] border-transparent text-[#7C7C7C]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="h-10 px-5 rounded-lg bg-white text-black text-sm font-Inter cursor-pointer hover:bg-gray-200 transition"
        >
          Add New rule
        </button>
      </div>

      {/* Rule Edit Modal  */}
      <RuleEdit
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSaved={() => setRefreshKey((k) => k + 1)}
      />

      {/* Rules */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {rulesData.map((rule) => (
          <div
            key={rule.id}
            className="bg-[#121212] border border-[#1A1A1A] rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <h3 className="text-[13px] font-Inter text-white leading-6">
                {rule.title}
              </h3>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-full text-[11px] font-Inter border border-[#00C66A] text-[#00E07A] bg-[#002B16]">
                  {rule.active ? "Active" : "Inactive"}
                </span>

                <button className="px-4 py-1.5 rounded-full font-Inter cursor-pointer bg-[#1A1A1A] text-xs text-white hover:bg-[#262626] transition">
                  Edit
                </button>
              </div>
            </div>

            <div className="w-full rounded-lg font-Inter bg-[#171717] px-4 py-3 text-xs text-[#777777] border border-[#171717]">
              {rule.condition}
            </div>

            <div className="w-full mt-3 rounded-lg font-Inter border border-[#00C853] bg-[#041B0D] px-4 py-3 text-xs text-[#00E676]">
              {rule.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
