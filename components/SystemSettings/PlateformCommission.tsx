"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

export default function PlateformCommission() {
  const { data } = useApi<{
    platformFeePercent: number;
    proPayoutDelayDays: number;
  }>("/settings/commission");

  const [editedPlatformFee, setPlatformFee] = useState<number | null>(null);
  const [editedPayoutDelay, setPayoutDelay] = useState<number | null>(null);
  const platformFee = editedPlatformFee ?? data?.platformFeePercent ?? 10;
  const payoutDelay = editedPayoutDelay ?? data?.proPayoutDelayDays ?? 3;

  const feePercentage = (platformFee / 20) * 100;
  const delayPercentage = ((payoutDelay - 1) / (30 - 1)) * 100;

  const patch = async (next: {
    platformFeePercent?: number;
    proPayoutDelayDays?: number;
  }) => {
    try {
      await api("/settings/commission", {
        method: "PATCH",
        body: JSON.stringify(next),
      });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-[#121212] px-4 pb-4 rounded-bl-2xl rounded-br-2xl">
      <div className="w-full rounded-2xl border border-white/8 bg-[#121212] p-4 sm:p-5 md:p-6">
        <h2 className="mb-5 text-lg font-Inter text-white">
          Platform Commission
        </h2>

        <div className="space-y-6">
          {/* Platform Fee */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="w-full md:w-45">
              <p className="text-sm font-Inter text-white">Platform Fee %</p>
            </div>

            <div className="flex flex-1 items-center gap-4">
              <div className="relative w-full h-1.5 rounded-full bg-[#1B1B1B]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-white"
                  style={{ width: `${feePercentage}%` }}
                />

                <input
                  type="range"
                  min={0}
                  max={20}
                  value={platformFee}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPlatformFee(v);
                    patch({ platformFeePercent: v });
                  }}
                  className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
                />
              </div>

              <span className="min-w-12.5 text-right text-sm font-Inter text-white">
                {platformFee}%
              </span>
            </div>
          </div>

          {/* Payout Delay */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="w-full md:w-45">
              <p className="text-sm font-Inter text-white">
                Pro Payout Delay (days)
              </p>
            </div>

            <div className="flex flex-1 items-center gap-4">
              <div className="relative w-full h-1.5 rounded-full bg-[#1B1B1B]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-white"
                  style={{ width: `${delayPercentage}%` }}
                />

                <input
                  type="range"
                  min={1}
                  max={30}
                  value={payoutDelay}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPayoutDelay(v);
                    patch({ proPayoutDelayDays: v });
                  }}
                  className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
                />
              </div>

              <span className="min-w-17.5 text-right text-sm font-Inter text-white">
                {payoutDelay} days
              </span>
            </div>
          </div>
        </div>

        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 9999px;
            background: #5b5bf7;
            cursor: pointer;
            border: none;
            margin-top: -4px;
          }

          input[type="range"]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 9999px;
            background: #5b5bf7;
            border: none;
            cursor: pointer;
          }

          input[type="range"]::-webkit-slider-runnable-track {
            background: transparent;
            height: 6px;
          }

          input[type="range"]::-moz-range-track {
            background: transparent;
            height: 6px;
          }
        `}</style>
      </div>
    </div>
  );
}
