"use client";

import { useMemo, useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import AddUserModal from "./AddUserModal";
import UserProfileDetail from "./UserProfileDetail";
import { useApi } from "@/lib/useApi";
import Image from "next/image";

type User = {
  id: number;
  name: string;
  email: string;
  city: string;
  role: "Client" | "Pro";
  joined: string;
  status: "Active" | "Inactive";
  avatar: string;
};

type UsersResponse = {
  items: User[];
  total: number;
  totalPages: number;
  page: number;
};

const ITEMS_PER_PAGE = 4;

export default function UserRoleTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openModal, setOpenModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [openDropdown, setOpenDropdown] = useState<
    "role" | "city" | "status" | null
  >(null);

  const roles = ["All Roles", "Client", "Pro"];
  const cities = ["All Cities", "Toronto", "New York", "London", "Paris", "Chicago"];
  const statuses = ["All Status", "Active", "Inactive"];

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(ITEMS_PER_PAGE));
    if (search) params.set("q", search);
    if (roleFilter !== "All Roles") params.set("role", roleFilter);
    if (cityFilter !== "All Cities") params.set("city", cityFilter);
    if (statusFilter !== "All Status") params.set("status", statusFilter);
    if (refreshKey) params.set("_", String(refreshKey));
    return `/users?${params.toString()}`;
  }, [currentPage, search, roleFilter, cityFilter, statusFilter, refreshKey]);

  const { data } = useApi<UsersResponse>(query);
  const paginatedUsers = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handleFilterChange = (
    type: "role" | "city" | "status",
    value: string,
  ) => {
    setCurrentPage(1);

    if (type === "role") setRoleFilter(value);
    if (type === "city") setCityFilter(value);
    if (type === "status") setStatusFilter(value);

    setOpenDropdown(null);
  };

  return (
    <div className="bg-[#121212] p-4 rounded-bl-2xl rounded-br-2xl">
      <div className="w-full rounded-3xl bg-[#1A1A1A] p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-sm font-Inter text-white md:text-lg">
            Users & Roles
          </h2>
          <p className="mt-1 text-sm font-Inter text-[#5A5A5A]">
            {total} registered accounts
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
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-full rounded-lg border border-[#2A2A2A] bg-[#171717] pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            {/* Role */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "role" ? null : "role")
                }
                className="flex h-11 md:min-w-25 w-full items-center justify-between gap-2 rounded-lg cursor-pointer font-Inter border border-[#2A2A2A] bg-[#171717] px-4 text-sm text-white"
              >
                {roleFilter}
                <FiChevronDown />
              </button>

              {openDropdown === "role" && (
                <div className="absolute top-12 z-50 w-full rounded-lg cursor-pointer border border-white/10 bg-[#111111] p-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleFilterChange("role", role)}
                      className={`mb-1 w-full rounded-lg px-3 py-2 font-Inter cursor-pointer text-left text-sm ${
                        roleFilter === role
                          ? "bg-[#00E5FF] text-black font-Inter"
                          : "text-white hover:bg-[#1A1A1A] font-Inter"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "city" ? null : "city")
                }
                className="flex h-11 md:min-w-25 w-full items-center justify-between gap-2 rounded-lg border border-[#2A2A2A] bg-[#171717] font-Inter cursor-pointer px-4 text-sm text-white"
              >
                {cityFilter}
                <FiChevronDown />
              </button>

              {openDropdown === "city" && (
                <div className="absolute top-12 z-50 w-full rounded-lg border cursor-pointer border-white/10 bg-[#111111] p-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleFilterChange("city", city)}
                      className={`mb-1 w-full rounded-lg px-3 py-2 cursor-pointer text-left text-sm ${
                        cityFilter === city
                          ? "bg-[#00E5FF] cursor-pointer font-Inter text-black"
                          : "text-white hover:bg-[#1A1A1A] font-Inter"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
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
            <button className="h-11 rounded-lg w-full md:min-w-25 font-Inter cursor-pointer bg-[#2A2A2A] px-5 text-sm font-medium text-white">
              Export
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="h-11 rounded-lg w-full md:min-w-30 font-Inter cursor-pointer bg-white px-5 text-sm font-semibold text-black"
            >
              Add Users
            </button>
          </div>
        </div>

        {/* Add User Modal */}
        <AddUserModal
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
                    Name
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">Email</th>
                  <th className="px-4 py-4 text-sm text-gray-400">City</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Role</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Joined</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Status</th>
                  <th className="rounded-r-xl px-4 py-4 text-sm text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b font-Inter border-white/5"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.avatar || "/images/user.png"}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                        <span className="text-white">{user.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-300">{user.email}</td>

                    <td className="px-4 py-4 text-gray-300">{user.city}</td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-4 py-1 text-sm ${
                          user.role === "Client"
                            ? "border-red-500 text-red-500"
                            : "border-indigo-500 text-indigo-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-white">{user.joined}</td>

                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-xl bg-[#111] px-5 py-2 text-sm text-emerald-400">
                        {user.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setOpenProfile(true);
                        }}
                        className="text-white cursor-pointer underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 cursor-pointer text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Profile Detail Modal */}
        <UserProfileDetail
          isOpen={openProfile}
          userId={selectedUserId}
          onClose={() => setOpenProfile(false)}
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
