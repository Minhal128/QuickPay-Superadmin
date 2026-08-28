"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useApi } from "@/lib/useApi";

type TransactionDetailData = {
  txId: string;
  user: string;
  amount: number;
  joined: string;
  date: string;
  type: string;
  method: string;
  service: string;
};

export default function TransactionDetail({
  isOpen,
  transactionId,
  onClose,
}: {
  isOpen: boolean;
  transactionId: number | null;
  onClose: () => void;
}) {
  const { data } = useApi<TransactionDetailData>(
    isOpen && transactionId ? `/transactions/${transactionId}` : null,
  );
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  const details = data
    ? [
        ["Tx ID", data.txId],
        ["User", data.user],
        ["Amount", `$${data.amount.toLocaleString()}`],
        ["Date", data.date],
        ["Type", data.type],
        ["Method", data.method],
        ["Service", data.service],
      ]
    : [];

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/60 z-9998 ${isOpen ? "block" : "hidden"}`} />
      <div className={`fixed top-0 right-0 h-screen w-80 sm:w-120 bg-[#111] border-l border-[#222] z-9999 transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="border-b border-[#222] px-5 py-5 flex items-center justify-between">
          <h2 className="text-white">Transaction Detail</h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer"><FiX size={20} /></button>
        </div>
        <div className="p-5">
          {data ? details.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-2 py-3 border-b border-[#262626]">
              <span className="text-[#7D7D7D] text-sm">{label}</span>
              <span className="text-white text-sm text-right">{value || "—"}</span>
            </div>
          )) : <p className="text-gray-400">Loading transaction…</p>}
        </div>
      </div>
    </>
  );
}
