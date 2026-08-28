import CampaignHistory from "@/components/Campaign/CampaignHistory";
import CampaignTopStats from "@/components/Campaign/CampaignTopStats";

export default function CampaignPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <CampaignTopStats />

      <div className="overflow-x-hidden">
        <CampaignHistory />
      </div>
    </div>
  );
}
