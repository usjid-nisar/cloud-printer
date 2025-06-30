export default function StatCard({ title, value, trend, trendText, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[220px]">
      <div className="text-gray-500 font-medium mb-2">{title}</div>
      <div className="flex items-end gap-2">
        <div className="text-3xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-1">{trendText}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}