import { FaBell, FaUserCircle } from "react-icons/fa";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between py-6 px-8 bg-white">
      <input
        type="text"
        placeholder="Search"
        className="border rounded-lg px-4 py-2 w-80 focus:outline-none"
      />
      <div className="flex items-center gap-6">
        <button className="relative">
          <FaBell className="text-xl" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button>
          <FaUserCircle className="text-2xl" />
        </button>
      </div>
    </header>
  );
}