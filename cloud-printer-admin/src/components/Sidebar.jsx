import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="bg-[#6C47FF] text-white w-64 min-h-screen flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 px-8 py-8">
          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-[#6C47FF] font-bold text-2xl">C</span>
          </div>
          <span className="font-bold text-2xl">Cloudprinter</span>
        </div>
        <nav className="mt-8">
          <Link to="/" className={`flex items-center gap-3 px-8 py-3 rounded-lg mb-2 ${location.pathname === "/" ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10"}`}>
            <span className="material-icons">dashboard</span>
            Dashboard
          </Link>
          <Link to="#" className="flex items-center gap-3 px-8 py-3 rounded-lg mb-2 hover:bg-white hover:bg-opacity-10">
            <span className="material-icons">groups</span>
            Clients
          </Link>
        </nav>
      </div>
      <div className="px-8 py-8">
        <button className="flex items-center gap-2 text-white hover:underline">
          <span className="material-icons">logout</span>
          Logout
        </button>
        <div className="text-xs mt-4 text-white/60">©2025 CloudPrinter.</div>
      </div>
    </div>
  );
};

export default Sidebar;