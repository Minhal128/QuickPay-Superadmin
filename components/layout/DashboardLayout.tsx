"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../Sidebar/Sidebar";
import LogoutModal from "../Sidebar/LogoutModal";
import MobileSidebar from "../Sidebar/MobileSidebar";
import Topbar from "../Topbar/Topbar";
import { api, type Admin } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api<{ admin: Admin }>("/auth/me")
      .then((d) => {
        setAdmin(d.admin);
        setReady(true);
      })
      .catch(() => {
        router.replace("/");
      });
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#000000] text-gray-400 flex items-center justify-center font-Inter text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#000000] text-white">
      <div
        className={`fixed left-0 top-0 z-40 hidden md:block transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLogoutClick={() => setOpenLogout(true)}
        />
      </div>

      {openLogout && <LogoutModal onClose={() => setOpenLogout(false)} />}

      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogoutClick={() => setOpenLogout(true)}
      />

      <div
        className={`flex min-h-screen flex-col md:p-2 bg-[#292a3f85] transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Topbar
          admin={admin}
          collapsed={collapsed}
          onMenuClick={() => {
            if (window.innerWidth < 768) {
              setSidebarOpen(true);
            } else {
              setCollapsed(!collapsed);
            }
          }}
        />

        <main className="flex-1 min-w-0 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
