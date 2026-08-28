"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import "leaflet/dist/leaflet.css";
import { useApi } from "@/lib/useApi";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false },
);

export default function ActivityCityView() {
  const { data } = useApi<{
    mapPoints: { lat: number; lng: number; size: number }[];
  }>("/bookings");
  const locations = data?.mapPoints ?? [];
  const [activeProsOpen, setActiveProsOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);

  const [selectedPro, setSelectedPro] = useState("Active Pros");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveProsOpen(false);
        setCitiesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#121212] px-4">
      <div className="w-full rounded-2xl bg-[#1A1A1A] p-3 sm:p-4">
        {/* Header */}
        <div
          ref={dropdownRef}
          className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <h2 className="text-sm font-Inter text-white md:text-lg">
            Active City view
          </h2>

          <div className="flex flex-wrap gap-2">
            {/* Active Pros Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setActiveProsOpen(!activeProsOpen);
                  setCitiesOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-[#1A1A1A] bg-[#121214] font-Inter px-4 cursor-pointer py-3 text-xs text-gray-300 transition"
              >
                {selectedPro}

                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeProsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeProsOpen && (
                <div className="absolute right-0 top-full z-9999 mt-2 w-44 overflow-hidden rounded-xl border border-[#232323] font-Inter cursor-pointer bg-[#121214] shadow-xl">
                  {["All Pros", "Active Now", "Busy", "Offline"].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSelectedPro(item);
                        setActiveProsOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-Inter cursor-pointer hover:bg-[#1A1A1A] ${
                        selectedPro === item ? "text-cyan-400" : "text-gray-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* All Cities Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setCitiesOpen(!citiesOpen);
                  setActiveProsOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-[#1A1A1A] bg-[#121214] px-4 py-3 font-Inter cursor-pointer text-xs text-gray-300 transition"
              >
                {selectedCity}

                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    citiesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {citiesOpen && (
                <div className="absolute right-0 top-full z-9999 mt-2 w-44 overflow-hidden rounded-xl border font-Inter border-[#232323] bg-[#121214] shadow-xl">
                  {["New York", "Chicago", "Los Angeles", "Houston"].map(
                    (city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setCitiesOpen(false);
                        }}
                        className={`w-full px-4 py-3 cursor-pointer text-left text-sm hover:bg-[#1A1A1A] ${
                          selectedCity === city
                            ? "text-cyan-400"
                            : "text-gray-300"
                        }`}
                      >
                        {city}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-xl">
          <div className="h-60 w-full md:h-105 lg:h-125">
            <MapContainer
              key="activity-city-map"
              center={[40.7618, -74.006]}
              zoom={12}
              zoomControl={false}
              attributionControl={false}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

              {locations.map((item, index) => (
                <CircleMarker
                  key={`glow-${index}`}
                  center={[item.lat, item.lng]}
                  radius={item.size + 8}
                  pathOptions={{
                    fillColor: "#00E5FF",
                    color: "#00E5FF",
                    fillOpacity: 0.12,
                    weight: 0,
                  }}
                />
              ))}

              {locations.map((item, index) => (
                <CircleMarker
                  key={index}
                  center={[item.lat, item.lng]}
                  radius={item.size}
                  pathOptions={{
                    fillColor: "#00E5FF",
                    color: "#00E5FF",
                    fillOpacity: 0.9,
                    weight: 1,
                  }}
                />
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
