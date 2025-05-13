import SettingsPage from "@/features/settings/pages/SettingsPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  );
}
