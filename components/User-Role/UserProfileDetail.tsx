"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { IoIosDocument } from "react-icons/io";
import UserChart from "./UserChat";
import { useApi } from "@/lib/useApi";
import Image from "next/image";

type UserDetail = {
  name: string;
  email: string;
  city: string;
  joined: string;
  status: string;
  avatar: string;
  userId: string;
  totalSpend: number;
  bookingsCount: number;
  kycStatus: string;
  distanceKm: number;
  activities: { id: number; title: string; time: string }[];
  activityCategories: string[];
  activitySeries: number[];
};

export default function UserProfileDetail({
  isOpen,
  userId,
  onClose,
}: {
  isOpen: boolean;
  userId: number | null;
  onClose: () => void;
}) {
  const { data } = useApi<UserDetail>(isOpen && userId ? `/users/${userId}` : null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const details = data
    ? [
        ["User ID", data.userId],
        ["City", data.city],
        ["Total Spend", `$${data.totalSpend.toLocaleString()}`],
        ["Joined", data.joined],
        ["Bookings", String(data.bookingsCount)],
        ["KYC Status", data.kycStatus],
        ["Distance", `${data.distanceKm} km`],
      ]
    : [];

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/60 z-9998 ${isOpen ? "block" : "hidden"}`} />
      <div className={`fixed top-0 right-0 h-screen w-80 sm:w-120 bg-[#111111] border-l border-[#222] z-9999 transition-transform flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="border-b border-[#222] px-5 py-5 flex items-center justify-between">
          <h2 className="text-white font-Inter">User Profile</h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer"><FiX size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {data ? (
            <>
              <div className="bg-[#1A1A1A] rounded-xl p-2 border border-[#262626] flex items-center gap-3">
                <Image src={data.avatar || "/images/user.png"} alt={data.name} width={48} height={48} className="w-12 h-12 rounded-full" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-white truncate">{data.name}</h4>
                  <p className="text-xs text-[#7B7B7B]">{data.email} · {data.city} · {data.joined}</p>
                </div>
                <span className="text-green-400 text-xs">{data.status}</span>
              </div>
              <div className="mt-3 border-b border-[#262626]">
                {details.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 px-2 py-3 border-b border-[#262626]">
                    <span className="text-[#7D7D7D] text-sm">{label}</span>
                    <span className="text-white text-sm text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 border border-[#262626] rounded-xl p-3">
                <h3 className="text-white mb-3">Activity</h3>
                <UserChart categories={data.activityCategories} data={data.activitySeries} />
              </div>
              <div className="mt-5 border border-[#262626] rounded-xl p-4">
                <h3 className="text-white mb-4">Recent Activity</h3>
                {data.activities.map((item) => (
                  <div key={item.id} className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#242424] flex items-center justify-center"><IoIosDocument size={14} /></div>
                    <div><p className="text-sm text-white">{item.title}</p><p className="text-xs text-[#8A8A8A]">{item.time}</p></div>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-gray-400">Loading user…</p>}
        </div>
      </div>
    </>
  );
}
