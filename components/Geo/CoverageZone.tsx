"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

interface CoverageZoneItem {
  id: number;
  name: string;
  status: string;
}

export default function CoverageZone() {
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data, error: loadError, setData } = useApi<{ items: CoverageZoneItem[] }>("/geo/zones");
  const coverageZones = data?.items ?? [];

  const saveZone = async (zone?: CoverageZoneItem) => {
    if (busy) return;
    const name = window.prompt("Coverage zone name", zone?.name ?? "")?.trim();
    if (!name) return;
    const status = zone
      ? window.prompt("Status: Included or Excluded", zone.status)?.trim()
      : "Included";
    if (!status || !["Included", "Excluded"].includes(status)) {
      setSaveError("Status must be Included or Excluded.");
      return;
    }

    setBusy(true);
    setSaveError(null);
    try {
      const saved = await api<CoverageZoneItem>(zone ? `/geo/zones/${zone.id}` : "/geo/zones", {
        method: zone ? "PATCH" : "POST",
        body: JSON.stringify({ name, status }),
      });
      setData({
        items: zone
          ? coverageZones.map((item) => (item.id === saved.id ? saved : item))
          : [...coverageZones, saved],
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save coverage zone.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-[#121212] px-4 pb-4 rounded-bl-2xl rounded-br-2xl">
      <div className="w-full rounded-3xl bg-[#1A1A1A] p-4 sm:p-5 md:p-6 border border-white/5">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm sm:text-lg font-Inter text-white">
            Coverage Zones
          </h2>

          <button
            onClick={() => saveZone()}
            disabled={busy}
            className="
            flex items-center justify-center gap-2
            rounded-xl border border-white/70
            px-5 py-3
            text-base font-Inter cursor-pointer text-white
            transition-all duration-200
            w-full sm:w-auto
          "
          >
            Add zone
          </button>
        </div>

        {(loadError || saveError) && (
          <p className="mb-4 text-sm text-red-400">{saveError || loadError}</p>
        )}

        {/* Zones List */}
        <div className="space-y-2">
          {coverageZones.map((zone) => (
            <div
              key={zone.id}
              className="
              flex flex-col gap-4
              rounded-2xl
              border border-white/5
              bg-[#171717]
              p-4
              md:flex-row
              md:items-center
              md:justify-between
            "
            >
              {/* Left Content */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm sm:text-lg font-Inter text-white">
                  {zone.name} — {zone.status}
                </h3>

                <p className="text-sm sm:text-sm font-Inter text-gray-500">
                  {zone.status === "Included"
                    ? "Included in service coverage"
                    : "Excluded from service coverage"}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => saveZone(zone)}
                disabled={busy}
                className="
                flex items-center justify-center gap-2
                rounded-2xl
                bg-[#151515]
                px-6 py-3
                text-sm font-Inter cursor-pointer text-white
                transition-all duration-200
                hover:bg-[#202020]
                w-full sm:w-auto
                min-w-32.5
              "
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
