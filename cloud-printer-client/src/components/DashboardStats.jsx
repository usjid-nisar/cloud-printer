import StatCard from "./StatCard";
import MiniLine from "./MiniLine";

export default function DashboardStats({ orders }) {
  const totalOrders = orders.length;
  const recentActivity = Math.min(orders.length, 1210); // Example for demo
  const forwarded = Math.round((orders.filter((o) => o.forwarded).length / totalOrders) * 100);
  const produced = 100 - forwarded;

  // Dummy trends for demo
  const trends = {
    totalOrders: 40,
    recentActivity: -10,
    forwarded: -10,
    produced: 20,
  };

  return (
    <div className="flex gap-6 mb-8 flex-wrap">
      <StatCard title="Total Orders" value={totalOrders} trend={trends.totalOrders} trendText="This week">
        <MiniLine color="green" />
      </StatCard>
      <StatCard title="Recent Activity" value={recentActivity} trend={trends.recentActivity} trendText="This week">
        <MiniLine color="red" />
      </StatCard>
      <StatCard title="Forwarded vs Self-Produced" value={
        <span>
          <span className="mr-4">{forwarded}% <span className="text-xs text-gray-400">Forwarded</span></span>
          <span>{produced}% <span className="text-xs text-gray-400">Produced</span></span>
        </span>
      }>
        <div className="flex gap-4 mt-2">
          <span className="text-red-600 text-xs">↓ {trends.forwarded}% Forwarded</span>
          <span className="text-green-600 text-xs">↑ {trends.produced}% Produced</span>
        </div>
      </StatCard>
    </div>
  );
}