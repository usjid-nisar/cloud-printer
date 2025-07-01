import { FaEye, FaEdit, FaTrash, FaRegClock, FaBook, FaHourglassHalf, FaCodeBranch, FaChartPie, FaMountain } from "react-icons/fa";

const clients = [
  {
    name: "Circooles",
    url: "getcircooles.com",
    email: "info@cloudprinter.com",
    date: "Jan 8, 2025",
    status: "Pending",
    icon: <FaRegClock className="text-blue-400 w-8 h-8" />,
  },
  {
    name: "Catalog",
    url: "catalogapp.io",
    email: "info@cloudprinter.com",
    date: "Jan 8, 2025",
    status: "Pending",
    icon: <FaBook className="text-purple-400 w-8 h-8" />,
  },
  {
    name: "Hourglass",
    url: "hourglass.app",
    email: "info@cloudprinter.com",
    date: "Jan 8, 2025",
    status: "Active",
    icon: <FaHourglassHalf className="text-blue-500 w-8 h-8" />,
  },
  {
    name: "Command+R",
    url: "cmdr.ai",
    email: "info@cloudprinter.com",
    date: "Jan 8, 2025",
    status: "In Active",
    icon: <FaCodeBranch className="text-orange-400 w-8 h-8" />,
  },
  {
    name: "Quotient",
    url: "quotient.co",
    email: "info@cloudprinter.com",
    date: "Jan 8, 2025",
    status: "Active",
    icon: <FaChartPie className="text-green-400 w-8 h-8" />,
  },
  {
    name: "Sisyphus",
    url: "sisyphus.com",
    email: "info@cloudprinter.com",
    date: "Jan 8, 2025",
    status: "Active",
    icon: <FaMountain className="text-indigo-400 w-8 h-8" />,
  },
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Active: "bg-green-100 text-green-700",
  "In Active": "bg-red-100 text-red-700",
};

export default function ClientsTable() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Onboarded Clients</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 border-b border-r border-gray-200 text-left font-semibold text-gray-600">Client Name</th>
              <th className="py-3 px-4 border-b border-r border-gray-200 text-left font-semibold text-gray-600">Email ID</th>
              <th className="py-3 px-4 border-b border-r border-gray-200 text-left font-semibold text-gray-600">Date</th>
              <th className="py-3 px-4 border-b border-r border-gray-200 text-left font-semibold text-gray-600">Account Status</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b border-r border-gray-200 flex items-center gap-3">
                  <span>{client.icon}</span>
                  <div>
                    <div className="font-bold">{client.name}</div>
                    <div className="text-xs text-gray-400">{client.url}</div>
                  </div>
                </td>
                <td className="py-3 px-4 border-b border-r border-gray-200">{client.email}</td>
                <td className="py-3 px-4 border-b border-r border-gray-200">{client.date}</td>
                <td className="py-3 px-4 border-b border-r border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[client.status]}`}>
                    {client.status}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  <div className="flex gap-3">
                    <button className="text-gray-500 hover:text-blue-600"><FaEye /></button>
                    <button className="text-gray-500 hover:text-green-600"><FaEdit /></button>
                    <button className="text-gray-500 hover:text-red-600"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button className="px-3 py-1 rounded bg-gray-100 text-gray-500">&lt;</button>
          <div className="flex gap-2">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} className={`px-3 py-1 rounded ${n === 1 ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}>{n}</button>
            ))}
          </div>
          <button className="px-3 py-1 rounded bg-gray-100 text-gray-500">&gt;</button>
        </div>
      </div>
    </div>
  );
}