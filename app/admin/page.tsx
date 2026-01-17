import { QuickInsightCards } from './(components)/dashboard/quick-insight-cards';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your landing page performance
        </p>
      </div>

      <QuickInsightCards />
    </div>
  );
}
