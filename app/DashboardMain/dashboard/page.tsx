import RecentActivity from "@/components/dashboard/RecentActivity";
import RecentTransaction from "@/components/dashboard/RecentTransaction";
import TopStats from "@/components/dashboard/TopStats";
import TransactionChart from "@/components/dashboard/TransactionChart";

export default function DashboardPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <TopStats />

      <div className="overflow-x-hidden">
        <TransactionChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <RecentTransaction />
        <RecentActivity />
      </div>
    </div>
  );
}
