import React, { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const fonts = ["Inter", "Roboto", "Montserrat", "Lato", "Poppins"];

export default function Settings() {
  const [companyName, setCompanyName] = useState("Cloud Printer");
  const [email, setEmail] = useState("olivia@untitledui.com");
  const [logo, setLogo] = useState(null);
  const [primaryColor, setPrimaryColor] = useState("#B692F6");
  const [secondaryColor, setSecondaryColor] = useState("#0D141C");
  const [buttonColor, setButtonColor] = useState("#7F56D9");
  const [font, setFont] = useState("Inter");
  const [showSuccess, setShowSuccess] = useState(false);
  const [search, setSearch] = useState("");

  const fileInput = useRef();

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setCompanyName("Cloud Printer");
    setEmail("olivia@untitledui.com");
    setLogo(null);
    setPrimaryColor("#B692F6");
    setSecondaryColor("#0D141C");
    setButtonColor("#7F56D9");
    setFont("Inter");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="Settings" />
      <div className="flex-1 flex flex-col">
        <Topbar search={search} setSearch={setSearch} />
        <main className="flex-1 overflow-y-auto flex flex-col items-center pt-10">
          {/* Success Toast */}
          {showSuccess && (
            <div className="fixed top-6 right-10 z-50 bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded-lg flex items-center shadow-lg">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="font-bold">Success!</div>
                <div className="text-sm">New company logo upload completed.</div>
              </div>
            </div>
          )}

          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10">
            <h1 className="text-2xl font-bold mb-8">Settings</h1>
            <form onSubmit={handleSave}>
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-1">Branding</h2>
                <p className="text-gray-500 text-sm mb-6">Update your logo and company details here.</p>
                <div className="mb-5">
                  <label className="font-medium block mb-2">Company Name</label>
                  <input
                    type="text"
                    className="border rounded-lg px-4 py-2 w-full"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="mb-5">
                  <label className="font-medium block mb-2">Email address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <rect x="3" y="7" width="18" height="10" rx="2" stroke="#aaa" strokeWidth="2"/>
                        <path d="M3 7l9 6 9-6" stroke="#aaa" strokeWidth="2"/>
                      </svg>
                    </span>
                    <input
                      type="email"
                      className="border rounded-lg px-10 py-2 w-full"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="font-medium block mb-2">Upload Company Logo</label>
                  <div className="flex items-center gap-4" onDrop={handleLogoDrop} onDragOver={e => e.preventDefault()}>
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                      {logo ? (
                        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                          <circle cx="18" cy="18" r="18" fill="#7c3aed" />
                          <path d="M18 8v8l7 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div
                      className="flex-1 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 transition"
                      onClick={() => fileInput.current.click()}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInput}
                        onChange={handleLogoUpload}
                      />
                      <span className="text-purple-600 font-medium cursor-pointer">Click to upload</span> or drag and drop<br />
                      <span className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="font-medium block mb-2">Select Primary/Banner Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="border rounded-lg px-2 py-1 w-28"
                    />
                    <button
                      type="button"
                      className="ml-2 px-4 py-1 rounded-lg font-semibold"
                      style={{ background: primaryColor, color: "#fff" }}
                    >
                      Banner
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">This will be used on your invoice banner</div>
                </div>
                <div>
                  <label className="font-medium block mb-2">Select Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="border rounded-lg px-2 py-1 w-28"
                    />
                    <span
                      className="ml-2 px-4 py-1 rounded-lg bg-gray-200 text-gray-700 font-semibold"
                      style={{ color: secondaryColor }}
                    >
                      Text color will look like this
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">This will be used for paragraph text</div>
                </div>
                <div>
                  <label className="font-medium block mb-2">Select Button Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={e => setButtonColor(e.target.value)}
                      className="w-10 h-10 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={buttonColor}
                      onChange={e => setButtonColor(e.target.value)}
                      className="border rounded-lg px-2 py-1 w-28"
                    />
                    <button
                      type="button"
                      className="ml-2 px-4 py-1 rounded-lg font-semibold"
                      style={{ background: buttonColor, color: "#fff" }}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">This will be used on buttons</div>
                </div>
                <div>
                  <label className="font-medium block mb-2">Select Font</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={font}
                      onChange={e => setFont(e.target.value)}
                      className="border rounded-lg px-2 py-1"
                    >
                      {fonts.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <span className="ml-2 px-4 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold" style={{ fontFamily: font }}>
                      Selected Font {font}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">This will be used on buttons</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-10">
                <button
                  type="button"
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}