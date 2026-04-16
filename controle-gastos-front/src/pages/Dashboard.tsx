import DashboardCards from "../components/dashboard/DashboardCards";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import DashboardInsights from "../components/dashboard/DashboardInsights";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardCards />
      <DashboardCharts />
      <DashboardInsights />
    </div>
  );
}