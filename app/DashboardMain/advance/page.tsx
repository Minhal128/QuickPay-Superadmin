import BookingRules from "@/components/Advance/BookingRules";
import FeatureFlag from "@/components/Advance/FeatureFlag";
import PricingLogic from "@/components/Advance/PricingLogic";
import RadiusCoverage from "@/components/Advance/RadiusCoverage";

export default function AdvancePage() {
  return (
    <div className="bg-[#121212] w-full p-4 rounded-bl-2xl rounded-br-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-3">
        <FeatureFlag />

        <div className="flex flex-col gap-3">
          <BookingRules />
          <PricingLogic />
          <RadiusCoverage />
        </div>
      </div>
    </div>
  );
}