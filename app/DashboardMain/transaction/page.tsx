import RevenueChart from "@/components/Transaction/RevenueChart";
import TransactionTable from "@/components/Transaction/TransactionTable";
import TransactionTopStats from "@/components/Transaction/TransactionTopStats";

export default function TransactionPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <TransactionTopStats />

      <div className="overflow-x-hidden">
        <RevenueChart />
      </div>

      <div className="overflow-x-hidden">
        <TransactionTable />
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <RecentTransaction />
        <RecentActivity />
      </div> */}
    </div>
  );
}
