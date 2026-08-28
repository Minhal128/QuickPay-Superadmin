"use client";

import { useEffect, useRef, useState } from "react";
import { FiX, FiChevronDown, FiUploadCloud, FiCheck } from "react-icons/fi";
import { api } from "@/lib/api";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const categories = ["Hair", "Spa", "Massage", "Makeup", "Nails", "Barber"];

const durations = [
  "15 mins",
  "30 mins",
  "45 mins",
  "60 mins",
  "90 mins",
  "120 mins",
];

const tags = ["Unisex", "Male", "Female"];

const cities = ["Barcelona", "Madrid", "Girona", "Espanyol"];

export default function AddServiceModal({
  isOpen,
  onClose,
  onCreated,
}: AddServiceModalProps) {
  const [name, setName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Hair");
  const [duration, setDuration] = useState("45 mins");
  const [busy, setBusy] = useState(false);

  const [showCategory, setShowCategory] = useState(false);
  const [showDuration, setShowDuration] = useState(false);

  const [selectedTag, setSelectedTag] = useState("Unisex");

  const [selectedCities, setSelectedCities] = useState<string[]>([
    "Barcelona",
    "Girona",
    "Espanyol",
  ]);

  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const submit = async (publish: boolean) => {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      await api("/catalog/services", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          category,
          duration,
          minPrice: Number(String(minPrice).replace(/[^0-9.]/g, "")) || 0,
          maxPrice: Number(String(maxPrice).replace(/[^0-9.]/g, "")) || 0,
          tag: selectedTag,
          cities: selectedCities,
          description,
          publish,
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

  useEffect(() => {
    const closeDropdowns = () => {
      setShowCategory(false);
      setShowDuration(false);
    };

    window.addEventListener("click", closeDropdowns);

    return () => {
      window.removeEventListener("click", closeDropdowns);
    };
  }, []);

  if (!isOpen) return null;

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city)
        ? prev.filter((item) => item !== city)
        : [...prev, city],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 md:p-6">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black text-white">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-black px-4 py-4">
          <h2 className="text-md font-Inter">Add/Edit service</h2>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center cursor-pointer rounded-lg hover:bg-white/10"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="scrollbar-hide max-h-[80vh] overflow-y-auto px-4 py-3">
          {/* Name */}
          <div>
            <label className="mb-2 block font-Inter text-sm text-gray-400">
              Service Name
            </label>

            <input
              type="text"
              placeholder="E.g Classic haircut"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full font-Inter rounded-lg border border-white/5 bg-zinc-900 px-4 outline-none focus:border-white/20"
            />
          </div>

          {/* Category */}
          <div className="relative mt-5">
            <label className="mb-2 block font-Inter text-sm text-gray-400">Category</label>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCategory(!showCategory);
                setShowDuration(false);
              }}
              className="flex h-12 font-Inter cursor-pointer w-full items-center justify-between rounded-lg border border-white/5 bg-zinc-900 px-4"
            >
              {category}
              <FiChevronDown />
            </button>

            {showCategory && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute z-20 mt-2 w-full cursor-pointer font-Inter rounded-xl border border-white/10 bg-zinc-900 p-2"
              >
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setCategory(item);
                      setShowCategory(false);
                    }}
                    className={`mb-1 flex w-full cursor-pointer font-Inter rounded-lg px-3 py-2 text-left text-sm transition ${
                      category === item
                        ? "bg-white text-black"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="relative mt-5">
            <label className="mb-2 block font-Inter text-sm text-gray-400">Duration</label>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDuration(!showDuration);
                setShowCategory(false);
              }}
              className="flex h-12 w-full cursor-pointer font-Inter items-center justify-between rounded-lg border border-white/5 bg-zinc-900 px-4"
            >
              {duration}
              <FiChevronDown />
            </button>

            {showDuration && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute z-20 mt-2 w-full cursor-pointer rounded-xl border border-white/10 bg-zinc-900 p-2"
              >
                {durations.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setDuration(item);
                      setShowDuration(false);
                    }}
                    className={`mb-1 flex w-full cursor-pointer font-Inter rounded-lg px-3 py-2 text-left text-sm transition ${
                      duration === item
                        ? "bg-white text-black"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prices */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-Inter text-gray-400">
                Minimum Price
              </label>

              <input
                type="text" 
                placeholder="E.g $13"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-12 w-full font-Inter rounded-lg border border-white/5 bg-zinc-900 px-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-Inter text-sm text-gray-400">
                Maximum Price
              </label>

              <input
                type="text"
                placeholder="E.g $20"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-12 w-full font-Inter rounded-lg border border-white/5 bg-zinc-900 px-4 outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mt-5">
            <label className="mb-3 block font-Inter text-sm text-gray-400">
              General tag
            </label>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`h-10 min-w-20 rounded-lg cursor-pointer font-Inter border px-4 text-sm transition ${
                    selectedTag === tag
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-zinc-900 text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div className="mt-6">
            <label className="mb-3 block font-Inter text-sm text-gray-400">
              Assigned cities
            </label>

            <div className="space-y-4">
              {cities.map((city) => {
                const active = selectedCities.includes(city);

                return (
                  <button
                    key={city}
                    onClick={() => toggleCity(city)}
                    className="flex items-center cursor-pointer gap-3"
                  >
                    <div
                      className={`flex h-5 w-5 items-center cursor-pointer font-Inter justify-center rounded-full border transition ${
                        active
                          ? "border-white font-Inter bg-white text-black"
                          : "border-white/20 font-Inter"
                      }`}
                    >
                      {active && <FiCheck size={12} />}
                    </div>

                    <span>{city}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload */}
          <div className="mt-6">
            <label className="mb-3 block text-sm font-Inter text-gray-400">
              Upload media
            </label>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center cursor-pointer font-Inter gap-4 rounded-xl border border-white/5 bg-zinc-900 p-4 text-left"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-800">
                <FiUploadCloud size={26} />
              </div>

              <div>
                <p className="font-Inter">
                  {file ? file.name : "Upload file"}
                </p>

                <p className="mt-1 text-xs font-Inter text-gray-400">
                  Jpg, Png, webp, HEIC (Max 50mb)
                </p>
              </div>
            </button>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="mb-3 block text-sm font-Inter text-gray-400">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Service description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border font-Inter border-white/5 bg-zinc-900 p-4 outline-none resize-none"
            />
          </div>

          <div className="mt-6 grid font-Inter grid-cols-2 gap-3 pb-2">
            <button
              disabled={busy}
              onClick={() => submit(false)}
              className="h-12 rounded-lg cursor-pointer bg-zinc-800"
            >
              Draft
            </button>

            <button
              disabled={busy}
              onClick={() => submit(true)}
              className="h-12 rounded-lg cursor-pointer bg-white text-black"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
