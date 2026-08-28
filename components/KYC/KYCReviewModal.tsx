"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import { IoIosDocument } from "react-icons/io";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

interface KYCReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycId?: number | null;
  onDone?: () => void;
}

type KycDetail = {
  name: string;
  roleBadge: string;
  email: string;
  city: string;
  joined: string;
  status: string;
  documents: { name: string; uploadedAt: string; sizeMb: number; url?: string }[];
};

export default function KYCReviewModal({
  isOpen,
  onClose,
  kycId,
  onDone,
}: KYCReviewModalProps) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const { data, loading, error } = useApi<KycDetail>(
    isOpen && kycId ? `/kyc/${kycId}` : null,
  );

  const handleApprove = async () => {
    if (!kycId || busy) return;
    setBusy(true);
    setActionError(null);
    try {
      await api(`/kyc/${kycId}/approve`, { method: "POST", body: "{}" });
      onDone?.();
      onClose();
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "Unable to approve KYC.");
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!kycId || busy) return;
    setBusy(true);
    setActionError(null);
    try {
      await api(`/kyc/${kycId}/reject`, {
        method: "POST",
        body: JSON.stringify({ note }),
      });
      onDone?.();
      onClose();
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "Unable to reject KYC.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-screen w-90 sm:w-120 bg-[#111111] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <h2 className="text-white text-md font-Inter">KYC Review</h2>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white cursor-pointer transition"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-5">
            {(error || actionError) && (
              <p className="mb-4 text-sm text-red-400">{actionError || error}</p>
            )}
            {loading && <p className="mb-4 text-sm text-gray-500">Loading review…</p>}
            <div className="bg-[#171717] rounded-xl p-4 border border-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <img
                    src="/images/user.png"
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-Inter text-sm">
                        {data?.name || "—"}
                      </h3>

                      <span className="px-2 py-0.5 rounded-full font-Inter text-[10px] border border-indigo-500 text-indigo-400">
                        {data?.roleBadge || "Pro"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 font-Inter mt-1">
                      {data
                        ? `${data.email} • ${data.city} • Date joined: ${data.joined}`
                        : "Loading…"}
                    </p>
                  </div>
                </div>

                <span className="text-[#F59E0B] text-xs font-Inter whitespace-nowrap">
                  {data?.status || "Pending KYC"}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {(data?.documents ?? []).map((doc) => (
                <div
                  key={doc.name}
                  className="border border-dashed border-white/10 rounded-xl p-2 bg-[#141414]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-[#252525] flex items-center justify-center">
                        <IoIosDocument size={20} className="text-gray-300" />
                      </div>

                      <div>
                        <h4 className="text-white text-sm font-Inter">
                          {doc.name}
                        </h4>
                        <p className="text-xs font-Inter text-gray-500">
                          Uploaded {doc.uploadedAt} • {doc.sizeMb}MB
                        </p>
                      </div>
                    </div>

                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white text-xs cursor-pointer font-Inter underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-xs font-Inter text-gray-600">No preview</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <label className="block text-sm font-Inter text-gray-400 mb-2">
                Reviewer Note (optional)
              </label>

              <textarea
                rows={4}
                placeholder="E.g Emma"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-[#232323] border text-sm font-Inter border-white/5 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-white/20 resize-none"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleReject}
                disabled={busy}
                className="h-10 cursor-pointer rounded-lg font-Inter border border-red-600 text-red-500 hover:bg-red-600/10 transition"
              >
                Reject
              </button>

              <button
                onClick={handleApprove}
                disabled={busy}
                className="h-10 cursor-pointer rounded-lg bg-white text-black font-Inter hover:bg-gray-200 transition"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
