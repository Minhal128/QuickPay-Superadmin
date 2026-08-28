"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { IoMdLogOut } from "react-icons/io";

const sections = [
  {
    title: "Overview",
    links: [
      {
        name: "Dashboard",
        path: "/DashboardMain/dashboard",
        activeIcon: "/images/homeactive.png",
        inactiveIcon: "/images/homeinactive.png",
      },
    ],
  },
  {
    title: "Live",
    links: [
      {
        name: "Live Operations",
        path: "/DashboardMain/liveoperation",
        activeIcon: "/images/liveactive.png",
        inactiveIcon: "/images/liveinactive.png",
      },
    ],
  },
  {
    title: "Management",
    links: [
      {
        name: "User & Roles",
        path: "/DashboardMain/userrole",
        activeIcon: "/images/useractive.png",
        inactiveIcon: "/images/userinactive.png",
      },
      {
        name: "CRM Global",
        path: "/DashboardMain/crm",
        activeIcon: "/images/crmactive.png",
        inactiveIcon: "/images/crminactive.png",
      },
      {
        name: "Catalog",
        path: "/DashboardMain/catelog",
        activeIcon: "/images/catelogactive.png",
        inactiveIcon: "/images/cateloginactive.png",
      },
      {
        name: "Stories & Contents",
        path: "/DashboardMain/story",
        activeIcon: "/images/storiesactive.png",
        inactiveIcon: "/images/storiesinactive.png",
      },
      {
        name: "Transactions",
        path: "/DashboardMain/transaction",
        activeIcon: "/images/transactionactive.png",
        inactiveIcon: "/images/transactioninactive.png",
      },
    ],
  },
  {
    title: "Operations",
    links: [
      {
        name: "KYC & Verify",
        path: "/DashboardMain/kyc",
        activeIcon: "/images/transactionactive.png",
        inactiveIcon: "/images/transactioninactive.png",
      },
      {
        name: "Campaigns",
        path: "/DashboardMain/campaign",
        activeIcon: "/images/campactive.png",
        inactiveIcon: "/images/campinactive.png",
      },
    ],
  },
  {
    title: "Finance",
    links: [
      {
        name: "Penalties & Refunds",
        path: "/DashboardMain/penalties",
        activeIcon: "/images/refundactive.png",
        inactiveIcon: "/images/redundinactive.png",
      },
      {
        name: "Reports & Analytics",
        path: "/DashboardMain/analytics",
        activeIcon: "/images/reportactive.png",
        inactiveIcon: "/images/reportinactive.png",
      },
    ],
  },
  {
    title: "Configuration",
    links: [
      {
        name: "System settings",
        path: "/DashboardMain/systemsettings",
        activeIcon: "/images/settingactive.png",
        inactiveIcon: "/images/settinginactive.png",
      },
      {
        name: "Advanced configuration",
        path: "/DashboardMain/advance",
        activeIcon: "/images/advanceactive.png",
        inactiveIcon: "/images/advanceinactive.png",
      },
      {
        name: "Geolocation",
        path: "/DashboardMain/geo",
        activeIcon: "/images/geoactive.png",
        inactiveIcon: "/images/geoinactive.png",
      },
      {
        name: "Rules engine",
        path: "/DashboardMain/rules",
        activeIcon: "/images/ruleactive.png",
        inactiveIcon: "/images/ruleinactive.png",
      },
      {
        name: "Audit",
        path: "/DashboardMain/audit",
        activeIcon: "/images/auditactive.png",
        inactiveIcon: "/images/auditinactive.png",
      },
    ],
  },
];

interface SidebarProps {
  onLogoutClick: () => void;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  onLogoutClick,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden md:flex flex-col h-screen bg-[#0F1014] border-r border-white/5 text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`shrink-0 border-b border-white/5 flex items-center ${
          collapsed ? "justify-center px-2 py-5" : "justify-between px-5 py-5"
        }`}
      >
        {!collapsed && (
          <h1 className="text-lg font-PlusJakartaSans-Bold tracking-wide">
            ABER
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 flex items-center bg-[#121212] justify-center rounded-md text-[#A0A3AD] hover:bg-white/5 hover:text-white transition-all cursor-pointer"
        >
          {collapsed ? (
            <LuPanelLeftOpen size={18} />
          ) : (
            <LuPanelLeftClose size={18} />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className={`${collapsed ? "px-2 py-4" : "px-3 py-4"}`}>
          {sections.map((section) => (
            <div
              key={section.title}
              className="mb-4 pb-2 border-b border-white/3 last:border-b-0"
            >
              {!collapsed && (
                <p className="px-3 mb-3 text-xs text-[#5F636D] font-PlusJakartaSans-Medium">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {section.links.map((link) => {
                  const isActive = pathname === link.path;

                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      title={collapsed ? link.name : ""}
                      className={`flex items-center rounded-md transition-all duration-200 font-PlusJakartaSans-Medium
                        ${
                          collapsed
                            ? "justify-center px-2 py-3"
                            : "gap-3 px-3 py-2.5"
                        }
                        ${
                          isActive
                            ? "bg-[#E8E8E8] text-[#111111]"
                            : "text-[#A0A3AD] hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <Image
                        src={isActive ? link.activeIcon : link.inactiveIcon}
                        alt={link.name}
                        width={18}
                        height={18}
                        className="shrink-0"
                      />

                      {!collapsed && (
                        <span className="text-[13px]">{link.name}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-white/5 p-3 bg-[#0F1014]">
        <button
          onClick={onLogoutClick}
          title="Logout"
          className={`w-full rounded-md text-[#FF3B30] hover:bg-white/5 transition-all duration-200 font-PlusJakartaSans-Medium cursor-pointer flex items-center ${
            collapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5"
          }`}
        >
          <IoMdLogOut size={18} />

          {!collapsed && <span className="text-[13px]">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
