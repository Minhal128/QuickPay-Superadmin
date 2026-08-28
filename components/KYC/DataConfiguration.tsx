"use client";

import { useMemo, useState } from "react";
import AddKYCField, { KycField, TabType } from "./AddKYCField";
import { useApi } from "@/lib/useApi";

export default function DataConfiguration({ refreshKey = 0 }: { refreshKey?: number }) {
  const [activeTab, setActiveTab] = useState<TabType>("Client");
  const [selectedField, setSelectedField] = useState<KycField | null>(null);
  const [adding, setAdding] = useState(false);
  const [localRefreshKey, setLocalRefreshKey] = useState(0);
  const query = useMemo(
    () =>
      `/kyc/fields?role=${encodeURIComponent(activeTab)}&_=${refreshKey}-${localRefreshKey}`,
    [activeTab, refreshKey, localRefreshKey],
  );
  const { data, loading, error } = useApi<{ items: KycField[] }>(query);
  const fields = data?.items ?? [];

  const saved = () => {
    setSelectedField(null);
    setAdding(false);
    setLocalRefreshKey((key) => key + 1);
  };

  return (
    <div className="w-full p-4 sm:p-5 lg:p-4">
      <h2 className="text-lg font-Inter text-white">Data configuration</h2>

      <div className="mt-5 flex flex-wrap gap-2 border-b border-[#1a1a1a] pb-3">
        {(["Client", "Professional", "Venue"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm font-Inter cursor-pointer transition-all duration-200 ${
              activeTab === tab
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute -bottom-3.25 left-0 h-0.5 w-full bg-white" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-[#141414] bg-[#080808] p-3">
        {error && <p className="p-4 text-sm text-red-400">{error}</p>}
        {!error && loading && <p className="p-4 text-sm text-gray-500">Loading fields…</p>}
        {!error && !loading && fields.length === 0 && (
          <p className="p-4 text-sm text-gray-500">No fields configured for {activeTab}.</p>
        )}

        <div className="space-y-3">
          {fields.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-[#131313] bg-[#090909] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-sm font-Inter text-white">{item.title}</h3>
                <p className="mt-1 text-xs font-Inter text-gray-500">
                  {item.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-center">
                <span
                  className={`rounded-full border px-4 py-1 text-xs font-Inter ${
                    item.required
                      ? "border-[#00D084] text-[#00D084]"
                      : "border-[#EAB308] text-[#EAB308]"
                  }`}
                >
                  {item.required ? "Required" : "Optional"}
                </span>
                <button
                  onClick={() => setSelectedField(item)}
                  className="min-w-22.5 rounded-xl bg-[#151515] px-5 py-2 text-xs font-Inter cursor-pointer text-white transition hover:bg-[#202020]"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setAdding(true)}
          className="mt-4 rounded-lg bg-white px-6 py-2 text-sm font-Inter cursor-pointer text-black transition hover:bg-gray-200"
        >
          Add field
        </button>
      </div>

      {(adding || selectedField) && (
        <AddKYCField
          isOpen
          roleTab={activeTab}
          field={selectedField}
          onClose={() => {
            setAdding(false);
            setSelectedField(null);
          }}
          onSaved={saved}
        />
      )}
    </div>
  );
}
