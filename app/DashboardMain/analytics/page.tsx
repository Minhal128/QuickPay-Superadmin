import AnalyticsTopStats from "@/components/Analytics/AnalyticsTopStats";
import BookingChart from "@/components/Analytics/BookingChart";
import BookingCities from "@/components/Analytics/BookingCities";
import RevenueChart from "@/components/Analytics/RevenueChart";

export default function AnalyticsPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <AnalyticsTopStats />

      <div className="overflow-x-hidden">
        <BookingChart />
      </div>

      <div className="overflow-x-hidden">
        <RevenueChart />
      </div>

      <div className="overflow-x-hidden">
        <BookingCities />
      </div>
    </div>
  );
}
