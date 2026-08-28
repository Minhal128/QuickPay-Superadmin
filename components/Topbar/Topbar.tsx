"use client";

import { useRef, useEffect } from "react";
import { Menu, Search } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoImg from "../../public/images/profile.png";
import type { Admin } from "@/lib/api";

interface TopbarProps {
  onMenuClick: () => void;
  collapsed: boolean;
  admin?: Admin | null;
}

export default function Topbar({ onMenuClick, admin }: TopbarProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const getTitle = () => {
    const map: Record<string, string> = {
      "/DashboardMain/home": "Home",
      "/DashboardMain/liveoperation": "Live Operations",
      "/DashboardMain/userrole": "User Role",
      "/DashboardMain/crm": "CRM Global",
      "/DashboardMain/catelog": "Catelog",
      "/DashboardMain/wishlist": "Wishlist",
      "/DashboardMain/transaction": "Transactions",
      "/DashboardMain/kyc": "KYC Verify",
      "/DashboardMain/campaign": "Campaigns",
      "/DashboardMain/penalties": "Penalties & Refunds",
      "/DashboardMain/analytics": "Reports & Analytics",
      "/DashboardMain/story": "Stories & contents",
      "/DashboardMain/systemsettings": "System Settings",
      "/DashboardMain/audit": "Audit Logs",
      "/DashboardMain/rules": "Rules Engine",
      "/DashboardMain/geo": "Geolocation & Coverage",
      "/DashboardMain/advance": "Advanced Configuration",
    };

    return map[pathname] || "Dashboard";
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full flex h-16 items-center rounded-tl-2xl rounded-tr-2xl justify-between border-b border-[#1A1A1A] bg-[#121212] px-4 md:px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="rounded-lg py-2 hover:bg-white/10 md:hidden"
        >
          <Menu className="h-3.5 w-3.5 text-white" />
        </button>

        <h1 className="text-white text-sm md:text-xl font-PlusJakartaSans-Medium">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center md:gap-4 gap-3" ref={wrapperRef}>
        <div className="hidden md:flex items-center gap-2 rounded-lg bg-[#171717] border border-[#1A1A1A] px-4 py-2.5 w-64">
          <Search className="h-4 w-4 text-white" />
          <input
            placeholder="Search"
            className="bg-transparent text-sm outline-none placeholder:text-gray-400 w-full text-white"
          />
        </div>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex items-center justify-center h-9 w-9 rounded-full overflow-hidden">
            <Image
              src={LogoImg}
              alt="Profile"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>

          <div className="hidden md:flex flex-col leading-tight mr-8">
            <span className="text-white text-sm font-Inter">
              {admin?.name || "Admin"}
            </span>
            <span className="text-gray-400 font-Inter-Regular text-xs">
              {admin?.email || ""}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
