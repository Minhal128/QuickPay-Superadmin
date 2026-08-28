import CityConfiguration from "@/components/Geo/CityConfiguration";
import CoverageZone from "@/components/Geo/CoverageZone";
import GeolocationMap from "@/components/Geo/GeolocationMap";

export default function GeoPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <GeolocationMap />

      <div className="overflow-x-hidden">
        <CityConfiguration />
      </div>

      <div className="overflow-x-hidden">
        <CoverageZone />
      </div>
      
    </div>
  );
}
