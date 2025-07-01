import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdListAlt, MdBarChart, MdSettings, MdToggleOn, MdLogout } from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-64 h-screen bg-purple-700 flex flex-col justify-between py-6 px-4">
      <div>
        <div className="flex items-center gap-2 mb-10 px-2">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="#fff" />
            <path d="M18 8v8l7 4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-2xl font-bold text-white">Cloudprinter</span>
        </div>
        <nav className="flex flex-col gap-2">
          <SidebarItem
            icon={<MdDashboard size={20} />}
            label="Dashboard"
            to="/dashboard"
            active={location.pathname === "/dashboard"}
          />
          <SidebarItem
            icon={<MdListAlt size={20} />}
            label="Order Status"
            to="/order-status"
            active={location.pathname === "/order-status"}
          />
          <SidebarItem 
          icon={<MdBarChart size={20} />} 
          label="Fulfilment Metrics"
          to="/fulfillment-metrics"
          active={location.pathname === "/fulfillment-metrics"}
           />
          <SidebarItem 
          icon={<MdSettings size={20} />}
           label="Settings" 
           to="/settings"
          active={location.pathname === "/settings"}
           />

          <SidebarItem icon={<MdToggleOn size={20} />}
           label="Forwarding Toggle"
           to="/forwarding-toggle"
          active={location.pathname === "/forwarding-toggle"}
           />
        </nav>
      </div>
      <div>
        <button className="flex items-center gap-2 text-white px-2 py-2 rounded hover:bg-purple-800 w-full">
          <MdLogout size={18} />
          Logout
        </button>
        <div className="text-xs text-purple-200 mt-6 px-2">©2025 CloudPrinter.</div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, to, active }) {
  if (to) {
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2 rounded text-left font-medium ${
          active
            ? "bg-white text-purple-700"
            : "text-purple-100 hover:bg-purple-600"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <span
      className="flex items-center gap-3 px-3 py-2 rounded text-left font-medium text-purple-100"
    >
      {icon}
      {label}
    </span>
  );
}