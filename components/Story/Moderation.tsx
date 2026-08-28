"use client";

import { useMemo, useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import StoryReview from "./StoryReview";
import CreateStory from "./CreateStory";
import { useApi } from "@/lib/useApi";

type ModerationItem = {
  id: number;
  story: string;
  type: string;
  visibility: string;
  submitted_by: string;
  billing: string;
  date: string;
  status: string;
};

type StoriesResponse = {
  items: ModerationItem[];
  total: number;
  totalPages: number;
};

const ITEMS_PER_PAGE = 4;

export default function Moderation() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [typeFilter, setTypeFilter] = useState("All Types");
  const [visibilityFilter, setVisibilityFilter] = useState("All Cities");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openStory, setOpenStory] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [openDropdown, setOpenDropdown] = useState<
    "type" | "visibility" | "status" | null
  >(null);

  const types = ["All Types", "Venue", "Paid"];

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(ITEMS_PER_PAGE));
    if (search) params.set("q", search);
    if (typeFilter !== "All Types") params.set("type", typeFilter);
    if (statusFilter !== "All Status") params.set("status", statusFilter);
    if (refreshKey) params.set("_", String(refreshKey));
    return `/stories?${params.toString()}`;
  }, [currentPage, search, typeFilter, statusFilter, refreshKey]);

  const { data } = useApi<StoriesResponse>(query);
  let paginatedItems = data?.items ?? [];
  if (visibilityFilter !== "All Cities") {
    paginatedItems = paginatedItems.filter(
      (item) => item.visibility === visibilityFilter,
    );
  }
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handleFilterChange = (
    type: "type" | "visibility" | "status",
    value: string,
  ) => {
    setCurrentPage(1);

    if (type === "type") setTypeFilter(value);
    if (type === "visibility") setVisibilityFilter(value);
    if (type === "status") setStatusFilter(value);

    setOpenDropdown(null);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-[#1A1A1A] text-yellow-500";
      case "Approved":
        return "bg-[#1A1A1A] text-emerald-500";
      case "Review":
        return "bg-[#1A1A1A] text-blue-500";
      default:
        return "bg-[#1A1A1A] text-gray-400";
    }
  };

  return (
    <div className="bg-[#121212] p-4 rounded-bl-2xl rounded-br-2xl">
      <div className="w-full rounded-3xl bg-[#1A1A1A] p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-sm font-Inter text-white md:text-lg">
            Moderation Queue
          </h2>
          <p className="mt-1 text-sm font-Inter text-[#5A5A5A]">
            {total} pending moderation
          </p>
        </div>

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            {/* Search */}
            <div className="relative w-full md:w-70">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search stories..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-full rounded-lg border border-[#2A2A2A] bg-[#171717] pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "type" ? null : "type")
                }
                className="flex h-11 md:min-w-25 w-full items-center justify-between gap-2 rounded-lg cursor-pointer font-Inter border border-[#2A2A2A] bg-[#171717] px-4 text-sm text-white"
              >
                {typeFilter}
                <FiChevronDown />
              </button>

              {openDropdown === "type" && (
                <div className="absolute top-12 z-50 w-full rounded-lg cursor-pointer border border-white/10 bg-[#111111] p-2">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange("type", type)}
                      className={`mb-1 w-full rounded-lg px-3 py-2 font-Inter cursor-pointer text-left text-sm ${
                        typeFilter === type
                          ? "bg-[#00E5FF] text-black font-Inter"
                          : "text-white hover:bg-[#1A1A1A] font-Inter"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-11 rounded-lg w-full md:min-w-30 font-Inter cursor-pointer bg-white px-5 text-sm font-semibold text-black"
            >
              Create stories
            </button>
          </div>
        </div>

        {/* Add User Modal - keeping for reference */}
        <CreateStory
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={() => setRefreshKey((k) => k + 1)}
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-250">
            <table className="w-full">
              <thead>
                <tr className="bg-[#171717] font-Inter text-left">
                  <th className="rounded-l-xl px-4 py-4 text-sm text-gray-400">
                    Story
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">Type</th>
                  <th className="px-4 py-4 text-sm text-gray-400">
                    Visibility
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">
                    Submitted by
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">Billing</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Date</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Status</th>
                  <th className="rounded-r-xl px-4 py-4 text-sm text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b font-Inter border-white/5"
                  >
                    <td className="px-4 py-4">
                      <span className="text-white">{item.story}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-300">{item.type}</td>
                    <td className="px-4 py-4 text-gray-300">
                      {item.visibility}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {item.submitted_by}
                    </td>
                    <td className="px-4 py-4 text-white">{item.billing}</td>
                    <td className="px-4 py-4 text-white">{item.date}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-4 py-1 text-sm ${getStatusStyles(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          setSelectedId(item.id);
                          setOpenStory(true);
                        }}
                        className="text-white cursor-pointer underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-10 cursor-pointer text-center text-gray-400"
                    >
                      No stories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Story Detail Modal */}
        <StoryReview
          isOpen={openStory}
          storyId={selectedId}
          onClose={() => setOpenStory(false)}
          onDone={() => setRefreshKey((k) => k + 1)}
        />

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
              disabled={currentPage === totalPages}
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
