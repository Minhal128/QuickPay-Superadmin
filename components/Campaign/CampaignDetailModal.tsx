"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import CampaignChart from "./CampaignChart";
import { useApi } from "@/lib/useApi";

type CampaignDetailData = {
  name: string;
  audience: string;
  sent: string;
  opened: string;
  clicked: string;
  status: string;
  date: string;
  statsSeries: number[];
};

export default function CampaignDetail({
  isOpen,
  campaignId,
  onClose,
}: {
  isOpen: boolean;
  campaignId: number | null;
  onClose: () => void;
}) {
  const { data } = useApi<CampaignDetailData>(
    isOpen && campaignId ? `/campaigns/${campaignId}` : null,
  );
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const details = data
    ? [
        ["Campaign Name", data.name],
        ["Audience", data.audience],
        ["Sent", data.sent],
        ["Opened", data.opened],
        ["Clicked", data.clicked],
        ["Status", data.status],
        ["Date", data.date],
      ]
    : [];

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/60 z-9998 ${isOpen ? "block" : "hidden"}`} />
      <div className={`fixed top-0 right-0 h-screen w-80 sm:w-120 bg-[#111] border-l border-[#222] z-9999 transition-transform flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="border-b border-[#222] px-5 py-5 flex items-center justify-between">
          <h2 className="text-white">Campaign Detail</h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer"><FiX size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {data ? (
            <>
              <div className="border-b border-[#262626]">
                {details.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 px-2 py-3 border-b border-[#262626]">
                    <span className="text-[#7D7D7D] text-sm">{label}</span>
                    <span className="text-white text-sm text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 border border-[#262626] rounded-xl p-3 bg-[#161616]">
                <h3 className="text-white">Statistics</h3>
                <CampaignChart data={data.statsSeries} />
              </div>
            </>
          ) : <p className="text-gray-400">Loading campaign…</p>}
        </div>
      </div>
    </>
  );
}
