"use client";

import { FiX } from "react-icons/fi";
import { IoIosDocument } from "react-icons/io";
import { useApi } from "@/lib/useApi";

type BookingDetailData = {
  bookingId: string;
  client: string;
  professional: string;
  services: string;
  city: string;
  status: string;
  amount: number;
  activities: { title: string; time: string }[];
};

export default function BookingDetail({
  isOpen,
  bookingId,
  onClose,
}: {
  isOpen: boolean;
  bookingId: string | null;
  onClose: () => void;
}) {
  const { data } = useApi<BookingDetailData>(
    isOpen && bookingId ? `/bookings/${bookingId}` : null,
  );
  const details = data
    ? [
        ["Booking ID", data.bookingId],
        ["Client", data.client],
        ["Professional", data.professional],
        ["Services", data.services],
        ["City", data.city],
        ["Status", data.status],
        ["Amount", `$${data.amount.toLocaleString()}`],
      ]
    : [];

  return (
    <>
      <div className={`fixed inset-0 z-99998 bg-black/50 ${isOpen ? "block" : "hidden"}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 z-99999 h-screen w-80 sm:w-105 bg-[#121212] border-l border-[#232323] transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-white">Booking details</h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer"><FiX size={20} /></button>
        </div>
        <div className="h-[calc(100vh-80px)] overflow-y-auto px-3 py-5">
          {data ? (
            <>
              <div className="border-b border-[#232323]">
                {details.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 px-4 py-3 border-b border-[#232323]">
                    <span className="text-gray-400 text-xs">{label}</span>
                    <span className="text-white text-xs text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border border-[#232323] rounded-xl p-3">
                <h3 className="text-white text-sm mb-4">Recent Activity</h3>
                {data.activities.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="flex gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-[#222] flex items-center justify-center"><IoIosDocument size={14} /></div>
                    <div><p className="text-xs text-white">{item.title}</p><p className="text-xs text-gray-500">{item.time}</p></div>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-gray-400">Loading booking…</p>}
        </div>
      </div>
    </>
  );
}
