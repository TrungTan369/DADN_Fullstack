import AnalyticsPage from "@/features/analytics/pages/AnalyticsPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <AnalyticsPage />
    </ProtectedRoute>
  );
}
