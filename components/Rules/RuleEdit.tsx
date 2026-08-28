"use client";

import { useState } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { api } from "@/lib/api";

interface RuleEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const ruleTypes = [
  "Cancellation",
  "Refund",
  "Booking",
  "Payment",
  "Commission",
  "Wallet",
];

export default function RuleEdit({ isOpen, onClose, onSaved }: RuleEditProps) {
  const [selectedType, setSelectedType] = useState("Cancellation");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [active, setActive] = useState(true);
  const [name, setName] = useState("");
  const [conditionIf, setConditionIf] = useState("");
  const [outcomeThen, setOutcomeThen] = useState("");
  const [priority, setPriority] = useState("1");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim() || !conditionIf.trim() || !outcomeThen.trim() || busy) return;
    setBusy(true);
    try {
      await api("/rules", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          type: selectedType,
          conditionIf,
          outcomeThen,
          priority: Number(priority) || 1,
          description,
          active,
        }),
      });
      onSaved?.();
      onClose();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black rounded-xl border border-[#1A1A1A] overflow-hidden max-h-[95vh]">
        <div className="sticky top-0 z-20 bg-black px-4 pt-5 pb-2 border-b border-[#1A1A1A]">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-md font-Inter">Rule Editor</h2>

            <button
              onClick={onClose}
              className="text-white cursor-pointer hover:text-gray-300 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(95vh-80px)] overflow-y-auto scrollbar-hide px-4 py-5">
          {/* Name */}
          <div className="mb-5">
            <label className="block text-gray-400 font-Inter text-sm mb-2">
              Rule Name
            </label>

            <input
              type="text"
              placeholder="E.g Lab cancellation penalty.."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 bg-[#0B0B0B] border text-sm font-Inter border-[#1A1A1A] rounded-lg px-4 text-white placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Rule */}
          <div className="mb-3 relative">
            <label className="block text-gray-400 font-Inter text-sm mb-2">
              Rule Type
            </label>

            <button
              type="button"
              onClick={() => setOpenDropdown(!openDropdown)}
              className="w-full h-12 px-4 bg-[#0B0B0B] border cursor-pointer font-Inter text-sm border-[#1A1A1A] rounded-lg flex items-center justify-between text-white"
            >
              <span>{selectedType}</span>
              <ChevronDown size={18} />
            </button>

            {openDropdown && (
              <div className="absolute top-full mt-2 left-0 w-full cursor-pointer font-Inter bg-[#111111] border border-[#1F1F1F] rounded-xl overflow-hidden z-30">
                {ruleTypes.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedType(item);
                      setOpenDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm cursor-pointer font-Inter text-white hover:bg-[#1A1A1A] flex items-center justify-between"
                  >
                    {item}

                    {selectedType === item && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Condition */}
          <div className="mb-3">
            <label className="block text-gray-400 font-Inter text-sm mb-2">
              Condition if
            </label>

            <textarea
              rows={3}
              placeholder="e.g Booking. cancel time &lt; 12h before start"
              value={conditionIf}
              onChange={(e) => setConditionIf(e.target.value)}
              className="w-full bg-[#0B0B0B] border font-Inter text-sm border-[#1A1A1A] rounded-lg p-4 text-white placeholder:text-gray-500 resize-none outline-none"
            />
          </div>

          {/* Outcome */}
          <div className="mb-3">
            <label className="block text-gray-400 font-Inter text-sm mb-2">
              Outcome (then)
            </label>

            <textarea
              rows={3}
              placeholder="e.g charge 50% penalty. refund 50% to wallet"
              value={outcomeThen}
              onChange={(e) => setOutcomeThen(e.target.value)}
              className="w-full bg-[#0B0B0B] border text-sm font-Inter border-[#1A1A1A] rounded-lg p-4 text-white placeholder:text-gray-500 resize-none outline-none"
            />
          </div>

          {/* Priority */}
          <div className="mb-3">
            <label className="block text-gray-400 font-Inter text-sm mb-2">
              Priority
            </label>

            <input
              type="number"
              placeholder="1= highest"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full h-12 bg-[#0B0B0B] font-Inter text-sm border border-[#1A1A1A] rounded-lg px-4 text-white placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block text-gray-400 font-Inter text-sm mb-2">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Service description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0B0B0B] border font-Inter text-sm border-[#1A1A1A] rounded-lg p-4 text-white placeholder:text-gray-500 resize-none outline-none"
            />
          </div>

          {/* Active */}
          <div className="bg-[#0B0B0B] border border-[#1A1A1A] rounded-xl p-4 mb-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white text-sm font-Inter">Active</h4>

                <p className="text-sm text-gray-500 font-Inter mt-1">
                  Rule will run on matching events
                </p>
              </div>

              <button
                onClick={() => setActive(!active)}
                className={`relative w-11 h-6 rounded-full transition ${
                  active ? "bg-white" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${
                    active ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="h-12 rounded-lg font-Inter text-sm cursor-pointer bg-[#1D1D1D] text-white hover:bg-[#2A2A2A] transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={busy}
              className="h-12 rounded-lg text-sm font-Inter cursor-pointer bg-white text-black hover:bg-gray-200 transition"
            >
              Save rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
