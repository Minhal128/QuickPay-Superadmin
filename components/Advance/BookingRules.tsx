"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

type BookingConfig = {
  minLeadTimeMin: number;
  maxBookingWindowDays: number;
  offerExpirationMin: number;
  maxActiveBookingsPerUser: number;
};

export default function BookingRules() {
  const { data } = useApi<BookingConfig>("/advance/booking");
  const [editedMinLeadTime, setMinLeadTime] = useState<number | null>(null);
  const [editedMaxBookingWindow, setMaxBookingWindow] = useState<number | null>(null);
  const [editedOfferExpiration, setOfferExpiration] = useState<number | null>(null);
  const [editedMaxBookings, setMaxBookings] = useState<number | null>(null);
  const minLeadTime = editedMinLeadTime ?? data?.minLeadTimeMin ?? 30;
  const maxBookingWindow = editedMaxBookingWindow ?? data?.maxBookingWindowDays ?? 14;
  const offerExpiration = editedOfferExpiration ?? data?.offerExpirationMin ?? 5;
  const maxBookings = editedMaxBookings ?? data?.maxActiveBookingsPerUser ?? 3;

  const patch = async (body: Partial<BookingConfig>) => {
    try {
      await api("/advance/booking", {
        method: "PATCH",
        body: JSON.stringify(body),
      });
    } catch {
      /* ignore */
    }
  };

  const getPercentage = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const bookingRules = [
    {
      label: "Min booking lead time (min)",
      value: minLeadTime,
      min: 0,
      max: 120,
      suffix: "m",
      onChange: (v: number) => {
        setMinLeadTime(v);
        patch({ minLeadTimeMin: v });
      },
    },
    {
      label: "Max booking window (days)",
      value: maxBookingWindow,
      min: 1,
      max: 30,
      suffix: "d",
      onChange: (v: number) => {
        setMaxBookingWindow(v);
        patch({ maxBookingWindowDays: v });
      },
    },
    {
      label: "Offer expiration (min)",
      value: offerExpiration,
      min: 1,
      max: 60,
      suffix: "m",
      onChange: (v: number) => {
        setOfferExpiration(v);
        patch({ offerExpirationMin: v });
      },
    },
    {
      label: "Max active bookings/user",
      value: maxBookings,
      min: 1,
      max: 10,
      suffix: "",
      onChange: (v: number) => {
        setMaxBookings(v);
        patch({ maxActiveBookingsPerUser: v });
      },
    },
  ];

  return (
    <div className="">
      <div className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] p-4 sm:p-5 md:p-4">
        <h2 className="mb-6 text-md font-Inter text-white">
          Booking Rules
        </h2>

        <div className="space-y-3">
          {bookingRules.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 md:flex-row md:items-center"
            >
              {/* Label */}
              <div className="w-full md:w-57.5 lg:w-65">
                <p className="text-sm sm:text-[14px] font-Inter text-[#A1A1AA]">
                  {item.label}
                </p>
              </div>

              {/* Slider + Value */}
              <div className="flex flex-1 items-center gap-2">
                <div className="relative h-1.5 w-full rounded-full bg-[#1B1B1B]">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-white"
                    style={{
                      width: `${getPercentage(
                        item.value,
                        item.min,
                        item.max
                      )}%`,
                    }}
                  />

                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    value={item.value}
                    onChange={(e) =>
                      item.onChange(Number(e.target.value))
                    }
                    className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
                  />
                </div>

                <span className="min-w-12.5 text-right text-sm font-Inter text-white">
                  {item.value}
                  {item.suffix}
                </span>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            background: #5b5bf7;
            cursor: pointer;
            border: none;
            margin-top: -5px;
          }

          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
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
