import Preferences from "@/components/CRM/Preferences";
import TopStats from "@/components/CRM/TopStats";

export default function CRMPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <TopStats />

      <div className="overflow-x-hidden">
        <Preferences />
      </div>

    </div>
  );
}
