"use client";

import { useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { api } from "@/lib/api";

export type TabType = "Client" | "Professional" | "Venue";

export type KycField = {
  id: number;
  title: string;
  subtitle: string;
  required: boolean;
  roleTab: TabType;
  field_type: string;
  validation_rule: string;
};

interface AddKYCFieldProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  roleTab: TabType;
  field?: KycField | null;
}

const fieldTypes = ["Text", "Number", "Email", "Date", "Phone", "Textarea"];

export default function AddKYCField({
  isOpen,
  onClose,
  onSaved,
  roleTab,
  field,
}: AddKYCFieldProps) {
  const [fieldName, setFieldName] = useState(field?.title ?? "");
  const [validationRule, setValidationRule] = useState(field?.validation_rule ?? "");
  const [fieldType, setFieldType] = useState(field?.field_type ?? "Text");
  const [required, setRequired] = useState(field?.required ?? true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!fieldName.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await api(field ? `/kyc/fields/${field.id}` : "/kyc/fields", {
        method: field ? "PATCH" : "POST",
        body: JSON.stringify({
          fieldName: fieldName.trim(),
          fieldType,
          roleTab,
          required,
          validationRule,
        }),
      });
      onSaved?.();
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save KYC field.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#1E1E1E] bg-black shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1A1A1A] px-6 py-5">
          <h2 className="text-md font-Inter text-white">
            {field ? "Edit KYC field" : "Add KYC field"}
          </h2>

          <button
            onClick={onClose}
            className="cursor-pointer text-white transition hover:opacity-70"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 scrollbar-hide">
          {/* Name */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-Inter text-[#7E7E7E]">
              Field Name
            </label>

            <input
              type="text"
              placeholder="E.g Lab cancellation penalty.."
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="h-12 w-full rounded-lg bg-[#0D0D0D] px-4 font-Inter text-sm text-white outline-none placeholder:text-[#4F4F4F]"
            />
          </div>

          {/* Type */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-Inter text-[#7E7E7E]">
              Field Type
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-12 w-full cursor-pointer items-center justify-between rounded-lg bg-[#0D0D0D] px-4 text-sm font-Inter text-white outline-none"
              >
                <span>{fieldType}</span>

                <svg
                  className={`h-4 w-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-14 z-20 overflow-hidden rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] shadow-lg">
                  {fieldTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFieldType(type);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm font-Inter transition hover:bg-[#1A1A1A] ${
                        fieldType === type ? "text-white" : "text-[#BDBDBD]"
                      }`}
                    >
                      {type}

                      {fieldType === type && (
                        <FiCheck size={16} className="text-white" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-Inter text-white">
              <input
                type="checkbox"
                checked={required}
                onChange={(event) => setRequired(event.target.checked)}
                className="h-4 w-4 accent-white"
              />
              Required for {roleTab}
            </label>
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          {/* Rule */}
          <div>
            <label className="mb-2 block text-sm font-Inter text-[#7E7E7E]">
              Validation Rule
            </label>

            <input
              type="text"
              placeholder="1= highest"
              value={validationRule}
              onChange={(e) => setValidationRule(e.target.value)}
              className="h-14 w-full rounded-lg bg-[#0D0D0D] px-4 font-Inter text-sm text-white outline-none placeholder:text-[#4F4F4F]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="h-12 cursor-pointer rounded-lg bg-[#232323] text-sm font-Inter text-white transition hover:bg-[#2D2D2D]"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={busy}
            className="h-12 cursor-pointer rounded-lg bg-white text-sm font-Inter text-black transition hover:bg-gray-200"
          >
            Save field
          </button>
        </div>
      </div>
    </div>
  );
}
