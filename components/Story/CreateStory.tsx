"use client";

import { useRef, useState } from "react";
import { FiX, FiUploadCloud } from "react-icons/fi";
import { api } from "@/lib/api";

interface CreateStoryProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const storyTypes = ["Global", "Venue", "Paid"];

export default function CreateStory({
  isOpen,
  onClose,
  onCreated,
}: CreateStoryProps) {
  const [selectedType, setSelectedType] = useState("Global");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [billing, setBilling] = useState("");
  const [busy, setBusy] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);
    setSelectedImage(URL.createObjectURL(file));
  };

  const submit = async (submitFlag: boolean) => {
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      await api("/stories", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          type: selectedType,
          caption,
          billingAmount: Number(billing) || 0,
          submit: submitFlag,
        }),
      });
      onCreated?.();
      onClose();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-999 bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="relative flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#050505] shadow-2xl">
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#050505] px-5 py-5 md:px-6">
            <h2 className="text-md font-Inter text-white">Create story</h2>

            <button
              onClick={onClose}
              className="text-white transition cursor-pointer hover:opacity-70"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6 scrollbar-hide">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-Inter text-[#A3A3A3]">
                  Title
                </label>

                <input
                  type="text"
                  placeholder="E.g drama"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 font-Inter w-full rounded-xl border border-white/5 bg-[#111111] px-4 text-white outline-none placeholder:text-[#666]"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-3 block text-sm font-Inter text-[#A3A3A3]">
                  Type
                </label>

                <div className="flex flex-wrap gap-2">
                  {storyTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`min-w-22.5 rounded-xl px-5 py-2.5 cursor-pointer text-xs font-Inter transition-all ${
                        selectedType === type
                          ? "border border-white bg-[#1A1A1A] text-white"
                          : "bg-[#1A1A1A] text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Media */}
              <div>
                <label className="mb-2 block text-sm font-Inter text-[#A3A3A3]">
                  Upload media
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-2xl border border-white/5 bg-[#111111] p-3 transition hover:border-white/20"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/heic"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <div className="flex flex-row gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#1D1D1D]">
                      <FiUploadCloud size={28} className="text-white" />
                    </div>

                    <div>
                      <h4 className="font-Inter text-sm text-white">
                        Upload file
                      </h4>
                      <p className="mt-1 text-xs font-Inter text-[#8A8A8A]">
                        Jpg, Png, Webp, HEIC (Max 50mb)
                      </p>
                      {fileName && (
                        <p className="mt-2 break-all text-xs text-green-400">
                          {fileName}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedImage && (
                    <div className="mt-4 overflow-hidden rounded-xl">
                      <img
                        src={selectedImage}
                        alt="preview"
                        className="h-52 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="mb-2 block text-sm font-Inter text-[#A3A3A3]">
                  Caption
                </label>

                <textarea
                  rows={5}
                  placeholder="What would you like to write"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full resize-none font-Inter text-sm rounded-xl border border-white/5 bg-[#111111] p-4 text-white outline-none placeholder:text-[#666]"
                />
              </div>

              {/* Billing */}
              <div>
                <label className="mb-2 block text-sm font-Inter text-[#A3A3A3]">
                  Paid story (Billing)
                </label>

                <input
                  type="number"
                  placeholder="0 = free"
                  value={billing}
                  onChange={(e) => setBilling(e.target.value)}
                  className="h-12 w-full rounded-xl font-Inter text-sm border border-white/5 bg-[#111111] px-4 text-white outline-none placeholder:text-[#666]"
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-20 bg-[#050505] p-5 md:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => submit(false)}
                className="h-12 rounded-xl bg-[#4A4A4A] font-Inter cursor-pointer text-white transition hover:opacity-90"
              >
                Draft
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => submit(true)}
                className="h-12 rounded-xl bg-white font-Inter cursor-pointer text-black transition hover:opacity-90"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
