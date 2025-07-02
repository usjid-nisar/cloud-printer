import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import OrdersTable from "../components/OrdersTable";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
          <OrdersTable />
        </main>
      </div>
    </div>
  );
}