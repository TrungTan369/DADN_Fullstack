import DeviceControllerPage from "@/features/devices/pages/DeviceControllerPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <DeviceControllerPage />
    </ProtectedRoute>
  );
}
