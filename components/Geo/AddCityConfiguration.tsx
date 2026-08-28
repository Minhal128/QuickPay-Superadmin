"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { api } from "@/lib/api";

interface AddCityConfigurationProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const countries = ["Spain", "France", "Germany", "Italy", "Portugal"];

const statuses = ["Active", "Inactive", "Pending"];

export default function AddCityConfiguration({
  isOpen,
  onClose,
  onCreated,
}: AddCityConfigurationProps) {
  const [name, setName] = useState("");
  const [searchRadius, setSearchRadius] = useState("16");
  const [proRadius, setProRadius] = useState("25");
  const [country, setCountry] = useState("Spain");
  const [status, setStatus] = useState("Active");
  const [busy, setBusy] = useState(false);

  const [countryOpen, setCountryOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [surgePricing, setSurgePricing] = useState(false);
  const [weekendAvailability, setWeekendAvailability] = useState(false);

  const countryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryRef.current &&
        !countryRef.current.contains(event.target as Node)
      ) {
        setCountryOpen(false);
      }

      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSave = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      await api("/geo/cities", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          country,
          searchRadiusKm: Number(searchRadius) || 15,
          proTravelRadiusKm: Number(proRadius) || 25,
          status,
          surgePricing,
          weekendAvailability,
        }),
      });
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
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/70 p-4 md:p-8">
      <div className="flex h-[90vh] w-full max-w-lg flex-col rounded-[28px] border border-white/10 bg-black">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#1B1B1B] bg-black px-5 py-5 md:px-6">
          <h2 className="text-md font-Inter text-white">City configuration</h2>

          <button
            onClick={onClose}
            className="cursor-pointer text-white transition hover:opacity-70"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="scrollbar-hide flex-1 overflow-y-auto px-5 py-5 md:px-6">
          <div className="space-y-4">
            {/* City Name */}
            <div>
              <label className="mb-2 block text-sm font-Inter text-[#7A7A7A]">
                City Name
              </label>

              <input
                type="text"
                placeholder="E.g Lab cancellation penalty.."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-xl text-sm border font-Inter border-[#1B1B1B] bg-[#0D0D0D] px-4 text-white outline-none placeholder:text-[#666]"
              />
            </div>

            {/* Country */}
            <div ref={countryRef}>
              <label className="mb-2 block text-sm font-Inter text-[#7A7A7A]">
                Counter
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCountryOpen(!countryOpen);
                    setStatusOpen(false);
                  }}
                  className="flex h-12 w-full items-center cursor-pointer text-sm font-Inter justify-between rounded-xl border border-[#1B1B1B] bg-[#0D0D0D] px-4 text-white"
                >
                  {country}

                  <FiChevronDown
                    className={`transition-transform ${
                      countryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {countryOpen && (
                  <div className="absolute left-0 top-full font-Inter text-sm cursor-pointer z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#232323] bg-[#111111]">
                    {countries.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setCountry(item);
                          setCountryOpen(false);
                        }}
                        className="block w-full cursor-pointer px-4 py-3 text-left text-white hover:bg-[#1A1A1A]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Radius */}
            <div>
              <label className="mb-2 block text-sm font-Inter text-[#7A7A7A]">
                Search radius (Km)
              </label>

              <input
                type="text"
                value={searchRadius}
                onChange={(e) => setSearchRadius(e.target.value)}
                className="h-12 w-full rounded-xl font-Inter text-sm border border-[#1B1B1B] bg-[#0D0D0D] px-4 text-white outline-none"
              />
            </div>

            {/* Pro Travel Radius */}
            <div>
              <label className="mb-2 block font-Inter text-sm text-[#7A7A7A]">
                Pro Travel Radius (km)
              </label>

              <input
                type="text"
                value={proRadius}
                onChange={(e) => setProRadius(e.target.value)}
                className="h-12 w-full rounded-xl font-Inter text-sm border border-[#1B1B1B] bg-[#0D0D0D] px-4 text-white outline-none"
              />
            </div>

            {/* Status */}
            <div ref={statusRef}>
              <label className="mb-2 block text-sm font-Inter text-[#7A7A7A]">
                Status
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setStatusOpen(!statusOpen);
                    setCountryOpen(false);
                  }}
                  className="flex h-12 w-full items-center font-Inter text-sm cursor-pointer justify-between rounded-xl border border-[#1B1B1B] bg-[#0D0D0D] px-4 text-white"
                >
                  {status}

                  <FiChevronDown
                    className={`transition-transform ${
                      statusOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {statusOpen && (
                  <div className="absolute left-0 top-full z-50 font-Inter text-sm cursor-pointer mt-2 w-full overflow-hidden rounded-xl border border-[#232323] bg-[#111111]">
                    {statuses.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setStatus(item);
                          setStatusOpen(false);
                        }}
                        className="block w-full cursor-pointer px-4 py-3 text-left text-white hover:bg-[#1A1A1A]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Surge Pricing */}
            <div className="flex items-center justify-between rounded-xl border border-[#1B1B1B] bg-[#0D0D0D] px-4 py-4">
              <span className="text-white font-Inter text-sm">
                Surge Pricing
              </span>

              <button
                onClick={() => setSurgePricing(!surgePricing)}
                className={`relative h-6 w-10 rounded-full transition ${
                  surgePricing ? "bg-white" : "bg-[#444]"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-black transition-all ${
                    surgePricing ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Weekend Availability */}
            <div className="flex items-center justify-between rounded-xl border border-[#1B1B1B] bg-[#0D0D0D] px-4 py-4">
              <span className="text-white font-Inter text-sm">
                Weekend availability
              </span>

              <button
                onClick={() => setWeekendAvailability(!weekendAvailability)}
                className={`relative h-6 w-10 rounded-full transition ${
                  weekendAvailability ? "bg-white" : "bg-[#444]"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-black transition-all ${
                    weekendAvailability ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-black p-5 md:p-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="h-12 cursor-pointer  rounded-xl bg-[#2B2B2B] font-Inter text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={busy}
              className="h-12 cursor-pointer rounded-xl bg-white font-Inter text-black"
            >
              Save city
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
