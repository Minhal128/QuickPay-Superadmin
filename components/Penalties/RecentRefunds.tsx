"use client";

import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

type Refund = {
  id: number;
  tx_id: string;
  user: string;
  amount: string;
  method: string;
  date: string;
  status: string;
};

export default function RecentRefunds() {
  const { data, setData } = useApi<{ items: Refund[] }>("/refunds");
  const refunds = data?.items ?? [];

  const handleAction = async (refund: Refund) => {
    try {
      if (refund.status === "Processing") {
        const updated = await api<Refund>(`/refunds/${refund.id}/override`, {
          method: "POST",
          body: "{}",
        });
        setData((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.map((r) =>
                  r.id === refund.id ? updated : r,
                ),
              }
            : prev,
        );
      } else if (refund.status === "Disputed") {
        const updated = await api<Refund>(`/refunds/${refund.id}/flag`, {
          method: "POST",
          body: "{}",
        });
        setData((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.map((r) =>
                  r.id === refund.id ? updated : r,
                ),
              }
            : prev,
        );
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-[#121212] p-4 rounded-bl-2xl rounded-br-2xl">
      <div className="w-full rounded-3xl bg-[#1A1A1A] p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-sm font-Inter text-white md:text-lg">
            Recent Refunds & Overrides
          </h2>
          <p className="mt-1 text-sm font-Inter text-[#5A5A5A]">
            Cancellation rules and refund tracking
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-250">
            <table className="w-full">
              <thead>
                <tr className="bg-[#171717] font-Inter text-left">
                  <th className="rounded-l-xl px-4 py-4 text-sm text-gray-400">
                    TX ID
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">User</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Amount</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Method</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Date</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Status</th>
                  <th className="rounded-r-xl px-4 py-4 text-sm text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {refunds.map((refund) => (
                  <tr
                    key={refund.id}
                    className="border-b font-Inter border-white/5"
                  >
                    <td className="px-4 py-4 text-white">{refund.tx_id}</td>
                    <td className="px-4 py-4 text-gray-300">{refund.user}</td>
                    <td className="px-4 py-4 text-white">{refund.amount}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-4 py-1 text-sm ${
                          refund.method === "Wallet"
                            ? "border-emerald-500 text-emerald-400"
                            : "border-blue-500 text-blue-400"
                        }`}
                      >
                        {refund.method}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-white">{refund.date}</td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-xl px-5 py-2 text-sm ${
                          refund.status === "Processing"
                            ? "bg-[#1A1A1A] text-yellow-400"
                            : refund.status === "Refunded"
                              ? "bg-[#1A1A1A] text-emerald-400"
                              : "bg-[#1A1A1A] text-red-400"
                        }`}
                      >
                        {refund.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleAction(refund)}
                        className="cursor-pointer underline text-white"
                      >
                        {refund.status === "Processing"
                          ? "Override"
                          : refund.status === "Disputed"
                            ? "Flag"
                            : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
