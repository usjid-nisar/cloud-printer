import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ViewModal from "../components/ViewModal";
import { useOrders } from "../context/OrdersContext";

const statusColors = {
  "In progress": "bg-yellow-100 text-yellow-700",
  "Failed": "bg-red-100 text-red-700",
  "Completed": "bg-green-100 text-green-700",
};
const statusOptions = ["All", "In progress", "Failed", "Completed"];
const ORDERS_PER_PAGE = 8;

export default function OrderStatus() {
  const { 
    orders, 
    loading, 
    error, 
    page, 
    totalPages, 
    updateOrder, 
    applyFilters, 
    changePage,
    refreshOrders 
  } = useOrders();

  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [viewOrder, setViewOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  // Reset selected orders when page changes
  useEffect(() => {
    setSelectedOrders(new Set());
  }, [page]);

  // Handlers
  const handleDelete = async (id) => {
    try {
      await updateOrder(id, 'deleted');
      setEditRow(null);
      setViewOrder(null);
      refreshOrders();
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  const handleEdit = (idx) => {
    setEditRow(idx);
    setEditData(orders[idx]);
  };

  const handleSave = async (idx) => {
    try {
      await updateOrder(editData.id, editData.status);
      setEditRow(null);
      refreshOrders();
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const handleCancel = () => setEditRow(null);

  // Filter and search handlers
  const handleFilter = (status) => {
    setFilter(status);
    applyFilters({
      status: status === "All" ? undefined : status,
      search
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    applyFilters({
      status: filter === "All" ? undefined : filter,
      search: value
    });
  };

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(new Set(orders.map(o => o.id)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (e, orderId) => {
    const newSelected = new Set(selectedOrders);
    if (e.target.checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    try {
      const promises = Array.from(selectedOrders).map(id => 
        updateOrder(id, action)
      );
      await Promise.all(promises);
      setSelectedOrders(new Set());
      refreshOrders();
    } catch (err) {
      console.error('Failed to perform bulk action:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar active="Order Status" />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin text-purple-600">↻</div>
              <span className="ml-2">Loading orders...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="Order Status" />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <h1 className="text-2xl font-bold mb-4">Order Status</h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
              {error}
              <button 
                onClick={refreshOrders}
                className="ml-2 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

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
                placeholder="Search by client name, URL, or order ID"
                value={search}
                onChange={handleSearch}
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 px-2">
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.size === orders.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="py-2 px-2">Client Name</th>
                    <th className="py-2 px-2">Order ID</th>
                    <th className="py-2 px-2">Order Date</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Integration Type</th>
                    <th className="py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-2 px-2">
                        <input 
                          type="checkbox"
                          checked={selectedOrders.has(order.id)}
                          onChange={(e) => handleSelectOrder(e, order.id)}
                        />
                      </td>
                      <td className="py-2 px-2 flex items-center gap-2">
                        <img src={order.client.avatar} alt="" className="w-7 h-7 rounded-full" />
                        <div>
                          {editRow === idx ? (
                            <input
                              name="clientName"
                              value={editData.client?.name || ""}
                              onChange={(e) => setEditData({
                                ...editData,
                                client: { ...editData.client, name: e.target.value }
                              })}
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
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            className="border px-2 py-1 rounded"
                          >
                            {statusOptions.slice(1).map((s) => (
                              <option key={s} value={s}>{s}</option>
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
                    onClick={() => changePage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              {selectedOrders.size > 0 && (
                <div className="flex gap-2">
                  <button 
                    className="px-4 py-2 rounded bg-red-50 text-red-600 font-medium hover:bg-red-100"
                    onClick={() => handleBulkAction('deleted')}
                  >
                    Delete Selected
                  </button>
                  <button 
                    className="px-4 py-2 rounded bg-green-50 text-green-600 font-medium hover:bg-green-100"
                    onClick={() => handleBulkAction('Completed')}
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
            {viewOrder && <ViewModal order={viewOrder} onClose={() => setViewOrder(null)} />}
          </div>
        </main>
      </div>
    </div>
  );
} 