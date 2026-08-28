"use client";

import React from "react";
import { useApi } from "@/lib/useApi";

type TransactionItem = {
  label: string;
  value: string;
  percentage: number;
};

const RecentTransaction = () => {
  const { data } = useApi<{ transactionBreakdown: TransactionItem[] }>(
    "/dashboard/overview",
  );
  const transactions = data?.transactionBreakdown ?? [];
  const colors = ["bg-[#4F46E5]", "bg-white", "bg-[#FF453A]"];

  return (
    <div className="md:px-3 px-4 pb-4 bg-[#121212] rounded-bl-2xl">
      <div className="w-full rounded-3xl bg-[#1A1A1A] p-4 sm:p-5 md:p-6 lg:p-7">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-Inter text-white md:text-lg">
            Recent Transactions
          </h2>

          <button className="text-xs font-Inter cursor-pointer text-cyan-400 transition hover:text-cyan-300">
            See All
          </button>
        </div>

        {/* Transaction */}
        <div className="space-y-5">
          {transactions.map((item, index) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-Inter text-gray-200 md:text-md">
                  {item.label}
                </span>

                <span className="text-sm font-Inter text-white md:text-md">
                  {item.value}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
                <div
                  className={`h-full ${colors[index % colors.length]}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentTransaction;
