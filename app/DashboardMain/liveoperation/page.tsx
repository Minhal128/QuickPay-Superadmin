import ActivityCityView from "@/components/LiveOperation/ActivityCityView";
import Booking from "@/components/LiveOperation/Booking";
import CityByHeat from "@/components/LiveOperation/CityByHeat";
import TopStats from "@/components/LiveOperation/TopStats";

export default function LiveOperationPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <TopStats />

      {/* Chart Fix */}
      <div className="overflow-x-hidden">
        <ActivityCityView />
      </div>

      <div className="bg-[#121212] p-3 rounded-bl-2xl rounded-br-2xl">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr] items-stretch">
          <Booking />
          <CityByHeat />
        </div>
      </div>
    </div>
  );
}
