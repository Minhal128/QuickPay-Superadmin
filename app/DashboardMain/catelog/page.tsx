import CatelogTopStats from "@/components/Catelog/CatelogTopStats";
import ServiceList from "@/components/Catelog/ServiceList";


export default function CatelogPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <CatelogTopStats />

      <div className="overflow-x-hidden">
        <ServiceList />
      </div>

    </div>
  );
}
