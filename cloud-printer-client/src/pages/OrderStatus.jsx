import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ViewModal from "../components/ViewModal";
import { useOrders } from "../context/OrdersContext";

const initialOrders = [
  {
    id: 1,
    client: { name: "Circooles", url: "getcirooles.com", avatar: "https://i.pravatar.cc/32?img=1" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "In progress",
    integration: "Shopify",
    forwarded: true,
  },
  {
    id: 2,
    client: { name: "Catalog", url: "catalogapp.io", avatar: "https://i.pravatar.cc/32?img=2" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "In progress",
    integration: "WooCommerce",
    forwarded: false,
  },
  {
    id: 3,
    client: { name: "Hourglass", url: "hourglass.app", avatar: "https://i.pravatar.cc/32?img=3" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "In progress",
    integration: "Shopify",
    forwarded: true,
  },
  {
    id: 4,
    client: { name: "Command+R", url: "cmdr.ai", avatar: "https://i.pravatar.cc/32?img=4" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "In progress",
    integration: "WooCommerce",
    forwarded: false,
  },
  {
    id: 5,
    client: { name: "Quotient", url: "quotient.co", avatar: "https://i.pravatar.cc/32?img=5" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "In progress",
    integration: "Shopify",
    forwarded: false,
  },
  {
    id: 6,
    client: { name: "Sisyphus", url: "sisyphus.com", avatar: "https://i.pravatar.cc/32?img=6" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "Failed",
    integration: "WooCommerce",
    forwarded: true,
  },
  {
    id: 7,
    client: { name: "Circooles", url: "getcirooles.com", avatar: "https://i.pravatar.cc/32?img=1" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "Failed",
    integration: "Shopify",
    forwarded: false,
  },
  {
    id: 8,
    client: { name: "Catalog", url: "catalogapp.io", avatar: "https://i.pravatar.cc/32?img=2" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "Completed",
    integration: "WooCommerce",
    forwarded: true,
  },
  {
    id: 9,
    client: { name: "Hourglass", url: "hourglass.app", avatar: "https://i.pravatar.cc/32?img=3" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "Completed",
    integration: "Shopify",
    forwarded: false,
  },
  {
    id: 10,
    client: { name: "Command+R", url: "cmdr.ai", avatar: "https://i.pravatar.cc/32?img=4" },
    orderId: "123456",
    date: "Jan 8, 2025",
    status: "Completed",
    integration: "WooCommerce",
    forwarded: true,
  },
];

const statusColors = {
  "In progress": "bg-yellow-100 text-yellow-700",
  "Failed": "bg-red-100 text-red-700",
  "Completed": "bg-green-100 text-green-700",
};
const statusOptions = ["All", "In progress", "Failed", "Completed"];
const ORDERS_PER_PAGE = 8;

export default function OrderStatus() {
  const { orders, setOrders } = useOrders();
  const [page, setPage] = useState(1);
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [viewOrder, setViewOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Filtering and searching
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === "All" || order.status === filter;
    const matchesSearch =
      order.client.name.toLowerCase().includes(search.toLowerCase()) ||
      order.client.url.toLowerCase().includes(search.toLowerCase()) ||
      order.orderId.includes(search);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const pagedOrders = filteredOrders.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE);

  // Handlers
  const handleDelete = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
    setEditRow(null);
    setViewOrder(null);
  };
  const handleEdit = (idx) => {
    setEditRow(idx);
    setEditData(pagedOrders[idx]);
  };
  const handleChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });
  const handleClientNameChange = (e) => setEditData({ ...editData, client: { ...editData.client, name: e.target.value } });
  const handleSave = (idx) => {
    const updated = [...orders];
    const globalIdx = orders.findIndex(o => o.id === pagedOrders[idx].id);
    updated[globalIdx] = editData;
    setOrders(updated);
    setEditRow(null);
  };
  const handleCancel = () => setEditRow(null);

  // Filter and search handlers
  const handleFilter = (status) => { setFilter(status); setPage(1); };
  const handleSearch = (e) => setSearch(e.target.value);

  // Submit/Cancel buttons
  const handleSubmit = () => alert("Submitted!");
  const handleCancelBtn = () => alert("Cancelled!");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="Order Status" />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <h1 className="text-2xl font-bold mb-4">Order Status</h1>
          {/* Filters and Search */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  className={`px-3 py-1 rounded font-medium ${filter === status ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:bg-gray-100"}`}
                  onClick={() => handleFilter(status)}
                >
                  {status === "All" ? "All Orders" : status}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearch}
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button className="flex items-center gap-1 px-3 py-2 border rounded text-gray-600 hover:bg-gray-100">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Filters
              </button>
            </div>
          </div>
          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 px-2"><input type="checkbox" /></th>
                    <th className="py-2 px-2">Client Name</th>
                    <th className="py-2 px-2">Order ID</th>
                    <th className="py-2 px-2">Order Date</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Integration Type</th>
                    <th className="py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {pagedOrders.map((order, idx) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-2 px-2"><input type="checkbox" /></td>
                      <td className="py-2 px-2 flex items-center gap-2">
                        <img src={order.client.avatar} alt="" className="w-7 h-7 rounded-full" />
                        <div>
                          {editRow === idx ? (
                            <input
                              name="clientName"
                              value={editData.client?.name || ""}
                              onChange={handleClientNameChange}
                              className="border px-2 py-1 rounded"
                            />
                          ) : (
                            <div className="font-medium">{order.client.name}</div>
                          )}
                          <div className="text-xs text-gray-400">{order.client.url}</div>
                        </div>
                      </td>
                      <td className="py-2 px-2">{order.orderId}</td>
                      <td className="py-2 px-2">{order.date}</td>
                      <td className="py-2 px-2">
                        {editRow === idx ? (
                          <select
                            name="status"
                            value={editData.status}
                            onChange={handleChange}
                            className="border px-2 py-1 rounded"
                          >
                            {statusOptions.slice(1).map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                            <span className="mr-1 text-[10px]">●</span>
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2">{order.integration}</td>
                      <td className="py-2 px-2 flex gap-2">
                        {editRow === idx ? (
                          <>
                            <button onClick={() => handleSave(idx)} className="text-green-600 mr-2">Save</button>
                            <button onClick={handleCancel} className="text-gray-500">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button title="View" className="text-gray-400 hover:text-purple-600" onClick={() => setViewOrder(order)}>
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12 18 19.5 12 19.5 1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                            </button>
                            <button title="Edit" className="text-gray-400 hover:text-purple-600" onClick={() => handleEdit(idx)}>
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5H4v-3L16.5 3.5Z" stroke="currentColor" strokeWidth="2"/><path d="M14 6l4 4" stroke="currentColor" strokeWidth="2"/></svg>
                            </button>
                            <button title="Delete" className="text-gray-400 hover:text-red-600" onClick={() => handleDelete(order.id)}>
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M9 6v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="2"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/></svg>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination and Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded ${page === i + 1 ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"}`}
                    onClick={() => { setEditRow(null); setPage(i + 1); }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="w-8 h-8 rounded hover:bg-gray-100"
                  onClick={() => { if (page < totalPages) { setEditRow(null); setPage(page + 1); } }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <div className="flex gap-2">
                <button className="px-5 py-2 rounded bg-gray-100 text-gray-700 font-medium" onClick={handleCancelBtn}>Cancel</button>
                <button className="px-5 py-2 rounded bg-purple-600 text-white font-medium" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
            {viewOrder && <ViewModal order={viewOrder} onClose={() => setViewOrder(null)} />}
          </div>
        </main>
      </div>
    </div>
  );
} 