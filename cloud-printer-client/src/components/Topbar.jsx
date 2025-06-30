export default function Topbar() {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b bg-white">
      <input
        type="text"
        placeholder="Search"
        className="w-72 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
      />
      <div className="flex items-center gap-4">
        <button className="relative">
          <svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="10" fill="#e5e7eb" /></svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="#7c3aed" />
            <path d="M18 8v8l7 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}