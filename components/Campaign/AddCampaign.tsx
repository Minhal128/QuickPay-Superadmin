"use client";

import { useEffect, useRef, useState } from "react";
import { FiX, FiChevronDown, FiCalendar } from "react-icons/fi";
import { api } from "@/lib/api";

interface AddCampaignProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const audienceOptions = [
  "Client",
  "Professional",
  "Both",
  "Premium Users",
  "Inactive Users",
];

export default function AddCampaign({
  isOpen,
  onClose,
  onCreated,
}: AddCampaignProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("Client");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submit = async (sendNow: boolean) => {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      await api("/campaigns", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          audience: selectedAudience,
          message,
          scheduleDate: scheduleDate || undefined,
          sendNow,
        }),
      });
      setName("");
      setMessage("");
      setScheduleDate("");
      onCreated?.();
      onClose();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-black shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-md font-Inter text-white">Create new campaign</h2>

          <button
            onClick={onClose}
            className="text-white transition cursor-pointer hover:opacity-70"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-Inter text-gray-400">
              Campaign name
            </label>

            <input
              type="text"
              placeholder="E.g drama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 w-full rounded-xl font-Inter text-sm border border-white/10 bg-[#0B0B0B] px-4 text-white outline-none placeholder:text-gray-500"
            />
          </div>

          {/* Audience Segment */}
          <div>
            <label className="mb-2 block text-sm font-Inter text-gray-400">
              Audience Segment
            </label>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-14 w-full font-Inter text-sm cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-[#0B0B0B] px-4 text-white"
              >
                {selectedAudience}

                <FiChevronDown
                  className={`transition ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full cursor-pointer z-20 font-Inter mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
                  {audienceOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedAudience(option);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center font-Inter cursor-pointer px-4 py-3 text-left text-sm transition hover:bg-white/10 ${
                        selectedAudience === option
                          ? "bg-white/10 text-white"
                          : "text-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="mb-2 block text-sm font-Inter text-gray-400">
              Message
            </label>

            <textarea
              rows={5}
              placeholder="Write your push notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none font-Inter text-sm rounded-xl border border-white/10 bg-[#0B0B0B] p-4 text-white outline-none placeholder:text-gray-500 focus:border-white/20"
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="mb-2 block text-sm font-Inter text-gray-400">
              Schedule
            </label>

            <div className="relative">
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="h-14 w-full rounded-xl border border-white/10 bg-[#0B0B0B] px-4 pr-12 text-white outline-none"
              />

              <FiCalendar className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => submit(false)}
              className="h-12 rounded-xl cursor-pointer bg-[#3B3B3B] font-Inter text-white transition hover:bg-[#4a4a4a]"
            >
              Draft
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => submit(true)}
              className="h-12 rounded-xl cursor-pointer bg-white font-Inter text-black transition hover:bg-gray-200"
            >
              Send Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
