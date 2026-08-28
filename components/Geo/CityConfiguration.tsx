"use client";

import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AddCityConfiguration from "./AddCityConfiguration";
import { useApi } from "@/lib/useApi";

type CityConfig = {
  id: number;
  name: string;
  search_radius: string;
  pro_radius: string;
  surge: "On" | "Off";
  status: string;
};

type CitiesResponse = {
  items: CityConfig[];
  total: number;
  totalPages: number;
};

const ITEMS_PER_PAGE = 4;

export default function CityConfiguration() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(ITEMS_PER_PAGE));
    if (refreshKey) params.set("_", String(refreshKey));
    return `/geo/cities?${params.toString()}`;
  }, [currentPage, refreshKey]);

  const { data } = useApi<CitiesResponse>(query);
  const paginatedCities = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="bg-[#121212] px-4 pb-4">
      <div className="w-full rounded-3xl bg-[#1A1A1A] p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-Inter text-white md:text-lg">
              City Configuration
            </h2>
            <p className="mt-1 text-sm font-Inter text-[#5A5A5A]">
              {total} registered accounts
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="h-11 rounded-lg w-full md:min-w-30 font-Inter cursor-pointer bg-white px-5 text-sm font-semibold text-black"
            >
              Add Users
            </button>
          </div>
        </div>

        {/* Add City Modal */}
        <AddCityConfiguration
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onCreated={() => setRefreshKey((k) => k + 1)}
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-250">
            <table className="w-full">
              <thead>
                <tr className="bg-[#171717] font-Inter text-left">
                  <th className="rounded-l-xl px-4 py-4 text-sm text-gray-400">
                    City
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">
                    Search radius
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">
                    Pro radius
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">Surge</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Status</th>
                  <th className="rounded-r-xl px-4 py-4 text-sm text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedCities.map((city) => (
                  <tr
                    key={city.id}
                    className="border-b font-Inter text-sm border-white/5"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-white">{city.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {city.search_radius}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {city.pro_radius}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-4 py-1 text-sm ${
                          city.surge === "On"
                            ? "border-emerald-500 text-emerald-400"
                            : "border-gray-500 text-gray-400"
                        }`}
                      >
                        {city.surge}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-xl bg-[#111] px-5 py-2 text-sm text-emerald-400">
                        {city.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setOpenModal(true)}
                        className="text-white cursor-pointer underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedCities.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      No cities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pages */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-400"></div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="flex h-14 w-10 cursor-pointer items-center justify-center rounded-lg text-white disabled:opacity-40"
            >
              <FiChevronLeft />
            </button>

            {Array.from({
              length: totalPages || 1,
            }).map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? "bg-cyan-400 text-black"
                      : "border border-white/10 bg-[#111111] text-white"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="flex h-14 cursor-pointer w-10 items-center justify-center rounded-lg text-white disabled:opacity-40"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
