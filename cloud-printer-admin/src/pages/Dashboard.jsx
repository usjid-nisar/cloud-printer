import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCards from "../components/StatCards";
import ClientsTable from "../components/ClientsTable";
import AddClientModal from "../components/AddClientModal";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1">
          <Topbar />
          <div className="px-10 py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Welcome!</h1>
              <button
                className="bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-700"
                onClick={() => setShowModal(true)}
              >
                Add new client <span className="text-xl">+</span>
              </button>
            </div>
            <StatCards />
            <ClientsTable />
          </div>
        </main>
      </div>
      <AddClientModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}