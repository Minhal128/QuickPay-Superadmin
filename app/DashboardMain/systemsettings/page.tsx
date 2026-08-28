import AdminPermission from "@/components/SystemSettings/AdminPermission";
import Notification from "@/components/SystemSettings/Notification";
import PlateformCommission from "@/components/SystemSettings/PlateformCommission";

export default function SystemSettingsPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <Notification />

      <div className="overflow-x-hidden">
        <AdminPermission />
      </div>

      <div className="overflow-x-hidden">
        <PlateformCommission />
      </div>
    </div>
  );
}
