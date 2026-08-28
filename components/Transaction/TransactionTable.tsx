"use client";

import { useMemo, useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from "react-icons/fi";
import TransactionDetail from "./TransactionDetail";
import { useApi } from "@/lib/useApi";

type Transaction = {
  id: number;
  txid: string;
  emailaddress: string;
  amount: number;
  type: "Payment" | "Withdrawl";
  date: string;
  status: "Active" | "Pending" | "Completed";
};

type TransactionsResponse = {
  items: Transaction[];
  total: number;
  totalPages: number;
};

const ITEMS_PER_PAGE = 4;

export default function TransactionTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("All types");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);

  const [openDropdown, setOpenDropdown] = useState<
    "type" | "status" | "fromDate" | "toDate" | null
  >(null);

  const types = ["All types", "Payment", "Withdrawl"];

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(ITEMS_PER_PAGE));
    if (search) params.set("q", search);
    if (typeFilter !== "All types") params.set("type", typeFilter);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    return `/transactions?${params.toString()}`;
  }, [currentPage, search, typeFilter, fromDate, toDate]);

  const { data } = useApi<TransactionsResponse>(query);
  let paginatedTransactions = data?.items ?? [];
  if (statusFilter !== "All Status") {
    paginatedTransactions = paginatedTransactions.filter(
      (t) => t.status === statusFilter,
    );
  }
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handleFilterChange = (type: "type" | "status", value: string) => {
    setCurrentPage(1);

    if (type === "type") setTypeFilter(value);
    if (type === "status") setStatusFilter(value);

    setOpenDropdown(null);
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-[#121212] p-4 rounded-bl-2xl rounded-br-2xl">
      <div className="w-full rounded-3xl bg-[#1A1A1A] p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-md font-Inter text-white md:text-lg">
            Transactions & Finance
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
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-full rounded-lg border border-[#2A2A2A] bg-[#171717] pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

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

            {/* Date */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "fromDate" ? null : "fromDate",
                  )
                }
                className="flex h-11 md:min-w-25 w-full items-center justify-between gap-2 rounded-lg border border-[#2A2A2A] bg-[#171717] font-Inter cursor-pointer px-4 text-sm text-white"
              >
                {fromDate ? fromDate : "From"}
                <FiCalendar />
              </button>

              {openDropdown === "fromDate" && (
                <div className="absolute top-12 z-50 w-auto rounded-lg border border-white/10 bg-[#111111] p-4">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setCurrentPage(1);
                      setOpenDropdown(null);
                    }}
                    className="rounded-lg border border-[#2A2A2A] bg-[#171717] px-3 py-2 text-sm text-white outline-none"
                  />
                </div>
              )}
            </div>

            {/* Date */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "toDate" ? null : "toDate")
                }
                className="flex h-11 md:min-w-25 w-full items-center justify-between gap-2 rounded-lg border border-[#2A2A2A] bg-[#171717] font-Inter cursor-pointer px-4 text-sm text-white"
              >
                {toDate ? toDate : "To"}
                <FiCalendar />
              </button>

              {openDropdown === "toDate" && (
                <div className="absolute top-12 z-50 w-auto rounded-lg border border-white/10 bg-[#111111] p-4">
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setCurrentPage(1);
                      setOpenDropdown(null);
                    }}
                    className="rounded-lg border border-[#2A2A2A] bg-[#171717] px-3 py-2 text-sm text-white outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              disabled
              className="h-11 rounded-lg w-full md:min-w-20 font-Inter cursor-pointer bg-white px-5 text-sm font-semibold text-black"
            >
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-250">
            <table className="w-full">
              <thead>
                <tr className="bg-[#171717] font-Inter text-left">
                  <th className="rounded-l-xl px-4 py-4 text-sm text-gray-400">
                    TXID
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">
                    Email address
                  </th>
                  <th className="px-4 py-4 text-sm text-gray-400">Amount</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Type</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Date</th>
                  <th className="px-4 py-4 text-sm text-gray-400">Status</th>
                  <th className="rounded-r-xl px-4 py-4 text-sm text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b font-Inter border-white/5"
                  >
                    <td className="px-4 py-4 text-white">{transaction.txid}</td>
                    <td className="px-4 py-4 text-gray-300">
                      {transaction.emailaddress}
                    </td>
                    <td className="px-4 py-4 text-white">
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-4 py-1 text-sm ${
                          transaction.type === "Payment"
                            ? "border-green-500 text-green-500"
                            : "border-[#4F46E5] text-[#4F46E5]"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white">{transaction.date}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-xl bg-[#111] px-5 py-2 text-sm text-emerald-400">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          setSelectedTransactionId(transaction.id);
                          setOpenProfile(true);
                        }}
                        className="text-white cursor-pointer underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 cursor-pointer text-center text-gray-400"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Detail Modal */}
        <TransactionDetail
          isOpen={openProfile}
          transactionId={selectedTransactionId}
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
