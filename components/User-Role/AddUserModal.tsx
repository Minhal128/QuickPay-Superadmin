"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { api } from "@/lib/api";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const roles = ["Client", "Pro", "Admin"];
const cities = ["Los Angeles", "New York", "Chicago", "Houston", "Miami"];

export default function AddUserModal({
  isOpen,
  onClose,
  onCreated,
}: AddUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Client");
  const [city, setCity] = useState("Los Angeles");
  const [submitting, setSubmitting] = useState(false);

  const [roleOpen, setRoleOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleOpen(false);
      }

      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await api("/users", {
        method: "POST",
        body: JSON.stringify({ fullName, email, role, city }),
      });
      setFullName("");
      setEmail("");
      setRole("Client");
      setCity("Los Angeles");
      onCreated?.();
      onClose();
    } catch {
      /* keep modal open */
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-black shadow-2xl">
        <div className="flex items-center justify-between px-5 md:px-7 pt-5 md:pt-7">
          <h2 className="text-sm md:text-xl font-Inter text-white">Add user</h2>

          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 cursor-pointer transition"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-7 space-y-3">
          {/* Name */}
          <div>
            <label className="mb-2 block text-xs md:text-sm font-Inter text-gray-400">
              Full name
            </label>

            <input
              type="text"
              placeholder="E.g Emma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-13 w-full rounded-xl border font-Inter border-white/10 bg-[#0c0c0c] px-4 text-white outline-none placeholder:text-gray-500 focus:border-white/30"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-xs md:text-sm text-gray-400">
              Email address
            </label>

            <input
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-13 font-Inter w-full rounded-xl border border-white/10 bg-[#0c0c0c] px-4 text-white outline-none placeholder:text-gray-500 focus:border-white/30"
            />
          </div>

          {/* Role */}
          <div ref={roleRef} className="relative">
            <label className="mb-2 block text-xs md:text-sm text-gray-400">
              Role
            </label>

            <button
              type="button"
              onClick={() => {
                setRoleOpen(!roleOpen);
                setCityOpen(false);
              }}
              className="flex h-13 font-Inter cursor-pointer w-full items-center justify-between rounded-xl border border-white/10 bg-[#0c0c0c] px-4 text-white"
            >
              <span>{role}</span>

              <FiChevronDown
                className={`transition-transform ${
                  roleOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {roleOpen && (
              <div className="absolute left-0 top-full z-50 font-Inter mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-2xl">
                {roles.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setRole(item);
                      setRoleOpen(false);
                    }}
                    className={`flex w-full items-center justify-between cursor-pointer px-4 py-3  text-left transition ${
                      role === item
                        ? "bg-white text-black"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* City */}
          <div ref={cityRef}>
            <label className="mb-2 block text-xs md:text-sm text-gray-400">
              City
            </label>

            <button
              type="button"
              onClick={() => {
                setCityOpen(!cityOpen);
                setRoleOpen(false);
              }}
              className="flex h-13 font-Inter w-full items-center cursor-pointer justify-between rounded-xl border border-white/10 bg-[#0c0c0c] px-4 text-white"
            >
              <span>{city}</span>

              <FiChevronDown
                className={`transition-transform ${
                  cityOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {cityOpen && (
              <div className="mt-2 w-full overflow-hidden cursor-pointer rounded-xl font-Inter border border-white/10 bg-[#111] shadow-2xl">
                {cities.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setCity(item);
                      setCityOpen(false);
                    }}
                    className={`flex w-full items-center cursor-pointer justify-between px-4 py-3 text-left transition ${
                      city === item
                        ? "bg-white text-black"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-13 w-full rounded-xl mt-2 bg-white text-md cursor-pointer font-Inter text-black transition hover:opacity-90"
          >
            Create user
          </button>
        </form>
      </div>
    </div>
  );
}
