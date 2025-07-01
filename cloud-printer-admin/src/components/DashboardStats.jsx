export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow flex flex-col">
        <span className="text-gray-500">Existing Clients</span>
        <span className="text-3xl font-bold">1,200</span>
        <span className="text-green-500 mt-2">↑ 40% This week</span>
      </div>
      <div className="bg-white p-6 rounded-lg shadow flex flex-col">
        <span className="text-gray-500">New Client Requests</span>
        <span className="text-3xl font-bold">15</span>
        <span className="text-red-500 mt-2">↓ 10% This week</span>
      </div>
    </div>
  );
}