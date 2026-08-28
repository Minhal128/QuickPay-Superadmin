import GrowthOverview from "@/components/User-Role/GrowthOverview";
import TopStats from "@/components/User-Role/TopStats";
import UserRoleTable from "@/components/User-Role/UserRoleTable";

export default function UserRolePage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <TopStats />

      <div className="overflow-x-hidden">
        <GrowthOverview />
      </div>

      <div className="overflow-x-hidden">
        <UserRoleTable />
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <RecentTransaction />
        <RecentActivity />
      </div> */}
    </div>
  );
}
