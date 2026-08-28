"use client";

import { useState } from "react";
import DataConfiguration from "./DataConfiguration";
import AddKYCField from "./AddKYCField";
import KYCReviewModal from "./KYCReviewModal";
import { useApi } from "@/lib/useApi";

type QueueItem = {
  id: number;
  name: string;
  subtitle: string;
  status: string;
};

export default function KycQueueTabs() {
  const [openModal, setOpenModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"queue" | "config">("queue");
  const [refreshKey, setRefreshKey] = useState(0);
  const [fieldRefreshKey, setFieldRefreshKey] = useState(0);

  const { data, loading, error } = useApi<{ items: QueueItem[] }>(
    `/kyc/queue${refreshKey ? `?_=${refreshKey}` : ""}`,
  );
  const queueData = data?.items ?? [];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-[#171717] text-[#F5B000]";
      case "Priority":
        return "bg-[#171717] text-[#FF4D4F]";
      case "In progress":
        return "bg-[#171717] text-[#4C6FFF]";
      default:
        return "bg-[#171717] text-white";
    }
  };

  return (
    <div className="bg-[#121212] p-4 rounded-bl-2xl rounded-br-2xl">
      <div className="w-full rounded-2xl border border-[#1B1B1B] bg-[#121212] p-2 md:p-3">
        <div className="mb-5 flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3 w-fit rounded-xl bg-[#121212] p-1">
            <button
              onClick={() => setActiveTab("queue")}
              className={`rounded-lg px-5 cursor-pointer py-2 text-sm font-Inter transition-all ${
                activeTab === "queue"
                  ? "border border-[#FFFFFF] bg-[#1A1A1A] text-white"
                  : "text-[#666]"
              }`}
            >
              Queue
            </button>

            <button
              onClick={() => setActiveTab("config")}
              className={`rounded-lg px-5 py-2 cursor-pointer text-sm font-Inter transition-all ${
                activeTab === "config"
                  ? "border border-[#FFFFFF] bg-[#1A1A1A] text-white"
                  : "text-[#666]"
              }`}
            >
              Data configuration
            </button>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="flex h-11 items-center cursor-pointer justify-center gap-2 rounded-lg bg-white px-5 text-sm font-Inter text-black transition hover:bg-gray-200"
          >
            Add KYC field
          </button>
        </div>

        {/* Add Field Modal */}
        {openModal && (
          <AddKYCField
            isOpen
            roleTab="Client"
            onClose={() => setOpenModal(false)}
            onSaved={() => {
              setFieldRefreshKey((key) => key + 1);
              setActiveTab("config");
            }}
          />
        )}

        {/* Queue */}
        {activeTab === "queue" && (
          <div className="rounded-2xl border border-[#151515] bg-[#0A0A0A]">
            <div className="border-b border-[#151515] px-5 py-4">
              <h2 className="text-lg font-Inter text-white">KYC Queue</h2>
            </div>

            <div className="p-4">
              {error && <p className="py-8 text-center text-sm text-red-400">{error}</p>}
              {!error && loading && (
                <p className="py-8 text-center text-sm text-gray-500">Loading KYC queue…</p>
              )}
              {!error && !loading && queueData.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-500">
                  No KYC submissions are awaiting review.
                </p>
              )}
              <div className="space-y-3">
                {queueData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setIsOpen(true);
                    }}
                    className="flex flex-col gap-4 cursor-pointer rounded-xl border border-[#121212] bg-[#080808] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-Inter text-white">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs font-Inter text-[#6B6B6B]">
                        {item.subtitle}
                      </p>
                    </div>

                    <div
                      className={`flex h-10 min-w-27.5 items-center justify-center rounded-lg px-4 text-sm font-Inter ${getStatusStyle(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* KYC Review Modal  */}
        {isOpen && selectedId && (
          <KYCReviewModal
            isOpen
            kycId={selectedId}
            onClose={() => {
              setIsOpen(false);
              setSelectedId(null);
            }}
            onDone={() => {
              setIsOpen(false);
              setSelectedId(null);
              setRefreshKey((k) => k + 1);
            }}
          />
        )}

        {/* Data Configuration Content */}
        {activeTab === "config" && (
          <div className="rounded-2xl border border-[#151515] bg-[#0A0A0A]">
            <DataConfiguration refreshKey={fieldRefreshKey} />
          </div>
        )}
      </div>
    </div>
  );
}
