"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import BookingDetail from "./BookingDetail";
import { useApi } from "@/lib/useApi";

type BookingItem = {
  id: string;
  client: string;
  service: string;
  pro: string;
  rating: number;
  bookings: number;
  status: "In progress" | "On the way" | "Accepted";
};

const statusStyles = {
  "In progress": "bg-[#1A1A1A] text-orange-400",
  "On the way": "bg-[#1A1A1A] text-blue-400",
  Accepted: "bg-[#1A1A1A] text-orange-400",
};

export default function Booking() {
  const [open, setOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const { data } = useApi<{ items: BookingItem[] }>("/bookings");
  const bookings = data?.items ?? [];

  return (
    <div className="bg-[#121212] rounded-bl-2xl">
      <div className="w-full rounded-3xl bg-[#0b0b0b] h-full border border-[#171717] p-4 md:p-3">
        <div className="flex items-center justify-between pb-5 border-b border-[#171717]">
          <h2 className="text-sm font-Inter text-white md:text-lg">
            Active Bookings
          </h2>

          <button className="text-cyan-400 hover:text-cyan-300 text-xs font-Inter transition">
            See All
          </button>
        </div>

        {/* Booking */}
        <div className="mt-2 space-y-2">
          {bookings.map((booking, index) => (
            <div
              key={`${booking.id}-${index}`}
              onClick={() => {
                setSelectedBookingId(booking.id);
                setOpen(true);
              }}
              className="rounded-2xl border cursor-pointer border-[#1b1b1b] bg-[#080808] overflow-hidden"
            >
              <div className="flex items-center justify-between p-3 md:px-3 border-b border-[#171717]">
                <span className="px-4 py-1.5 rounded-full bg-[#1A1A1A] text-[#7c7c7c] md:text-xs text-xs font-Inter">
                  {booking.id}
                </span>

                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-Inter ${
                    statusStyles[booking.status] || statusStyles.Accepted
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="p-4 sm:px-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div>
                    <h3 className="text-white md:text-md text-sm font-Inter">
                      Client: {booking.client}
                    </h3>

                    <p className="text-[#777] md:text-sm text-xs font-Inter mt-1">
                      {booking.service}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <h3 className="text-white md:text-md text-sm font-Inter">
                      Pro: {booking.pro}
                    </h3>

                    <div className="flex md:justify-end items-center gap-2 mt-2">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-[#9c9c9c] md:text-sm text-xs font-Inter">
                        {booking.rating}
                      </span>
                      <span className="text-[#6d6d6d] md:text-sm text-xs font-Inter">
                        · {booking.bookings} booking
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <BookingDetail
          isOpen={open}
          bookingId={selectedBookingId}
          onClose={() => setOpen(false)}
        />
      </div>
    </div>
  );
}
