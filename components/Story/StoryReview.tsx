"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

interface UserProfileDetailProps {
  isOpen: boolean;
  onClose: () => void;
  storyId?: number | null;
  onDone?: () => void;
}

type StoryDetail = {
  title: string;
  visibility: string;
  submittedBy: string;
  billing: string;
  views: number;
  type: string;
  clicks: number;
};

export default function StoryReview({
  isOpen,
  onClose,
  storyId,
  onDone,
}: UserProfileDetailProps) {
  const [busy, setBusy] = useState(false);
  const { data } = useApi<StoryDetail>(
    isOpen && storyId ? `/stories/${storyId}` : null,
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleReject = async () => {
    if (!storyId || busy) return;
    setBusy(true);
    try {
      await api(`/stories/${storyId}/reject`, { method: "POST", body: "{}" });
      onDone?.();
      onClose();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  const handleApprove = async () => {
    if (!storyId || busy) return;
    setBusy(true);
    try {
      await api(`/stories/${storyId}/approve`, { method: "POST", body: "{}" });
      onDone?.();
      onClose();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  const rows: [string, string][] = data
    ? [
        ["Title", data.title],
        ["Visibility", data.visibility],
        ["Submitted By", data.submittedBy],
        ["Billing", data.billing],
        ["Views", String(data.views)],
        ["Type", data.type],
        ["Clicks", String(data.clicks)],
      ]
    : [
        ["Title", "—"],
        ["Visibility", "—"],
        ["Submitted By", "—"],
        ["Billing", "—"],
        ["Views", "—"],
        ["Type", "—"],
        ["Clicks", "—"],
      ];

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-9998 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-80 sm:w-120 bg-[#111111] border-l border-[#222222] z-9999 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-20 bg-[#111111] border-b border-[#222222] px-5 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-md font-Inter">Story Review</h2>

          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-5">
          {/* Details */}
          <div>
            <div className="border-b border-[#262626] overflow-hidden">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 px-2 py-3 border-b border-[#262626] last:border-b-0"
                >
                  <span className="text-[#7D7D7D] font-Inter text-sm">
                    {label}
                  </span>

                  <span
                    className={`text-sm font-Inter text-right ${
                      label === "Type" ? "text-green-500" : "text-white"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6 pb-5">
            <button
              onClick={handleReject}
              disabled={busy}
              className="h-11 rounded-lg text-sm bg-[#22140C] font-Inter cursor-pointer border border-red-600 text-red-500 hover:bg-red-600/10 transition-colors"
            >
              Reject
            </button>

            <button
              onClick={handleApprove}
              disabled={busy}
              className="h-11 rounded-lg text-sm bg-white font-Inter text-black cursor-pointer hover:bg-gray-200 transition-colors"
            >
              Approved and publish
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
