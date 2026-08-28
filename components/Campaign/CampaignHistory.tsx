"use client";

import { useMemo, useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import CampaignDetail from "./CampaignDetailModal";
import AddCampaign from "./AddCampaign";
import { useApi } from "@/lib/useApi";

type Campaign = {
  id: number;
  campaign: string;
  audience: string;
  sent: string;
  opened: string;
  clicked: string;
  status: "Sent" | "Scheduled" | "Draft";
};

type CampaignsResponse = {
  items: Campaign[];
  totalPages: number;
};

const ITEMS_PER_PAGE = 4;

export default function CampaignHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [audienceFilter, setAudienceFilter] = useState("All Audiences");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [openCampaign, setOpenCampaign] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<
    "audience" | "status" | null
  >(null);

  const statuses = ["All Status", "Sent", "Scheduled", "Draft"];

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(ITEMS_PER_PAGE));
    if (search) params.set("q", search);
    if (audienceFilter !== "All Audiences") params.set("audience", audienceFilter);
    if (statusFilter !== "All Status") params.set("status", statusFilter);
    if (refreshKey) params.set("_", String(refreshKey));
    return `/campaigns?${params.toString()}`;
  }, [currentPage, search, audienceFilter, statusFilter, refreshKey]);

  const { data } = useApi<CampaignsResponse>(query);
  const paginatedCampaigns = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleFilterChange = (type: "audience" | "status", value: string) => {
    setCurrentPage(1);

    if (type === "audience") setAudienceFilter(value);
    if (type === "status") setStatusFilter(value);

    setOpenDropdown(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Scheduled":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Draft":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="bg-[#121212] p-4 rounded-bl-2xl rounded-br-2xl">
      <div className="w-full rounded-3xl bg-[#1A1A1A] p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-sm font-Inter text-white md:text-lg">
            Campaign History
          </h2>
          <p className="mt-1 text-sm font-Inter text-[#5A5A5A]">
            Push notifications & audience targeting
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
                placeholder="Search campaigns"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-full rounded-lg border font-Inter border-[#2A2A2A] bg-[#171717] pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "status" ? null : "status")
                }
                className="flex h-11 md:min-w-25 w-full items-center justify-between gap-2 rounded-lg border border-[#2A2A2A] bg-[#171717] font-Inter cursor-pointer px-4 text-sm text-white"
              >
                {statusFilter}
                <FiChevronDown />
              </button>

              {openDropdown === "status" && (
                <div className="absolute top-12 z-50 w-full rounded-lg cursor-pointer border border-white/10 bg-[#111111] p-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleFilterChange("status", status)}
                      className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
                        statusFilter === status
                          ? "bg-[#00E5FF] cursor-pointer font-Inter text-black"
                          : "text-white cursor-pointer hover:bg-[#1A1A1A]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-11 rounded-lg w-full md:min-w-30 font-Inter cursor-pointer bg-white px-5 text-sm text-black"
            >
              Create Campaign
            </button>
          </div>
        </div>

        {/* Add Campaign Modal  */}
        <AddCampaign
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
                    Campaign
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">Audience</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Sent</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Opened</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Clicked</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Status</th>
                  <th className="rounded-r-xl px-4 py-4 text-sm text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b font-Inter border-white/5"
                  >
                    <td className="px-4 py-4 text-white font-medium">
                      {campaign.campaign}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {campaign.audience}
                    </td>
                    <td className="px-4 py-4 text-gray-300">{campaign.sent}</td>
                    <td className="px-4 py-4 text-gray-300">
                      {campaign.opened}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {campaign.clicked}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-4 py-1 text-sm ${getStatusBadgeClass(
                          campaign.status,
                        )}`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          setSelectedCampaignId(campaign.id);
                          setOpenCampaign(true);
                        }}
                        className="text-white cursor-pointer underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedCampaigns.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 cursor-pointer text-center text-gray-400"
                    >
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campaign Detail Modal */}
        <CampaignDetail
          isOpen={openCampaign}
          campaignId={selectedCampaignId}
          onClose={() => setOpenCampaign(false)}
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
                  className={`h-10 w-10 rounded-lg text-sm font-Inter ${
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
