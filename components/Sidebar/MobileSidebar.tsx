"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdCloseCircleOutline, IoMdLogOut } from "react-icons/io";
import Image from "next/image";

interface MobileSidebarProps {
  onClose: () => void;
  isOpen: boolean;
  onLogoutClick: () => void;
}

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

const bottomLinks = [
  {
    name: "Logout",
    icon: IoMdLogOut,
  },
];

export default function MobileSidebar({
  onClose,
  isOpen,
  onLogoutClick,
}: MobileSidebarProps) {
  const pathname = usePathname();

  const handleClick = () => {
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F0F1A] text-white md:hidden flex flex-col h-screen transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <h1 className="text-md font-PlusJakartaSans-Bold tracking-wide">
            ABER
          </h1>

          <button onClick={onClose}>
            <IoMdCloseCircleOutline size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-xs text-gray-500 px-3 mb-2">{section.title}</p>

              <div className="space-y-1">
                {section.links.map((link) => {
                  const isActive = pathname.startsWith(link.path);

                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={handleClick}
                      className={`relative flex items-center gap-3 px-3 py-2 rounded-md transition ${
                        isActive
                          ? "bg-[#E8E8E8] text-[#111111]"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Image
                        src={isActive ? link.activeIcon : link.inactiveIcon}
                        alt={link.name}
                        width={18}
                        height={18}
                      />

                      <span className="text-sm">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          {bottomLinks.map((link) => {
            const Icon = link.icon;

            return (
              <button
                key={link.name}
                onClick={() => {
                  onClose();
                  onLogoutClick();
                }}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-[#FF3B30] hover:text-white hover:bg-white/5"
              >
                <Icon size={18} />
                <span className="text-sm">{link.name}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
