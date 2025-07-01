import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getForwardingSettings, updateForwardingSettings } from "../services/order";

export default function ForwardingToggle() {
  const [forwarding, setForwarding] = useState("cloud"); // "cloud" or "self"
  const [apiKey, setApiKey] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [integration, setIntegration] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch initial settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const settings = await getForwardingSettings();
        setForwarding(settings.forwardingType || "cloud");
        setApiKey(settings.apiKey || "");
        setAdditionalInfo(settings.additionalInfo || "");
        setIntegration(settings.integration || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Reset all fields
  const handleCancel = () => {
    setForwarding("cloud");
    setApiKey("");
    setAdditionalInfo("");
    setIntegration("");
    setShowDropdown(false);
    setError(null);
    setSuccess(false);
  };

  // Save handler
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await updateForwardingSettings({
        forwardingType: forwarding,
        apiKey: forwarding === "cloud" ? apiKey : undefined,
        additionalInfo: forwarding === "self" ? additionalInfo : undefined,
        integration: forwarding === "self" ? integration : undefined,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !success) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar active="Forwarding Toggle" />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin text-purple-600">↻</div>
              <span className="ml-2">Loading settings...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="Forwarding Toggle" />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10 mt-8">
            <h1 className="text-2xl font-bold mb-8">Forwarding Toggle</h1>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 text-green-600 rounded">
                Settings saved successfully!
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-1">Forwarding Toggle</h2>
                <p className="text-gray-500 text-sm mb-6">Configure your order forwarding settings here.</p>
                <hr className="mb-8" />
                {/* Order Forwarding Setting */}
                <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6">
                  <div className="md:w-1/3">
                    <label className="font-medium block mb-1">Order Forwarding Setting</label>
                    <span className="text-xs text-gray-400">Print facility type</span>
                  </div>
                  <div className="md:w-2/3 flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-l-lg border ${forwarding === "cloud" ? "bg-purple-100 text-purple-700 border-purple-400" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      Cloud Printer
                    </span>
                    {/* Toggle */}
                    <button
                      type="button"
                      aria-label="Toggle Forwarding"
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${forwarding === "self" ? "bg-purple-500" : "bg-gray-300"}`}
                      onClick={() => setForwarding(forwarding === "cloud" ? "self" : "cloud")}
                      disabled={loading}
                    >
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${forwarding === "self" ? "translate-x-6" : ""}`}
                      />
                    </button>
                    <span className={`px-4 py-2 rounded-r-lg border ${forwarding === "self" ? "bg-purple-100 text-purple-700 border-purple-400" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      Self Produce
                    </span>
                    <span className="ml-2 text-gray-400 cursor-pointer" title="Print facility type info">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#aaa">?</text></svg>
                    </span>
                  </div>
                </div>

                {/* Cloud Printer: API Key */}
                {forwarding === "cloud" && (
                  <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6">
                    <div className="md:w-1/3">
                      <label className="font-medium block mb-1">Print partner API key</label>
                      <span className="text-xs text-gray-400">Required for cloud printing integration</span>
                    </div>
                    <div className="md:w-2/3 flex items-center gap-2">
                      <input
                        type="text"
                        className="border rounded-lg px-4 py-2 w-full"
                        placeholder="Enter your API key here..."
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        required={forwarding === "cloud"}
                        disabled={loading}
                      />
                      <span className="ml-2 text-gray-400 cursor-pointer" title="API key info">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#aaa">?</text></svg>
                      </span>
                    </div>
                  </div>
                )}

                {/* Self Produce: Additional Details */}
                {forwarding === "self" && (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-md font-bold mb-1">Enter additional details</h2>
                      <p className="text-gray-500 text-sm mb-6">Add your print facility details below</p>
                      <hr className="mb-8" />
                      <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6">
                        <div className="md:w-1/3">
                          <label className="font-medium block mb-1">Enter additional info</label>
                          <span className="text-xs text-gray-400">Print facility info comes here</span>
                        </div>
                        <div className="md:w-2/3 flex items-center gap-2">
                          <input
                            type="text"
                            className="border rounded-lg px-4 py-2 w-full"
                            placeholder="Write here..."
                            value={additionalInfo}
                            onChange={e => setAdditionalInfo(e.target.value)}
                            required={forwarding === "self"}
                            disabled={loading}
                          />
                          <span className="ml-2 text-gray-400 cursor-pointer" title="Additional info">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#aaa">?</text></svg>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6">
                        <div className="md:w-1/3">
                          <label className="font-medium block mb-1">Select your integration</label>
                          <span className="text-xs text-gray-400">Select an option</span>
                        </div>
                        <div className="md:w-2/3 flex items-center gap-2 relative">
                          <div className="w-full">
                            <button
                              type="button"
                              className={`border rounded-lg px-4 py-2 w-full text-left ${showDropdown ? "border-purple-400" : ""}`}
                              onClick={() => setShowDropdown(!showDropdown)}
                              disabled={loading}
                            >
                              {integration ? integration : "Select"}
                              <span className="float-right">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                  <path d="M6 9l6 6 6-6" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </span>
                            </button>
                            {showDropdown && (
                              <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg">
                                {["Shopify", "WooCommerce"].map(opt => (
                                  <div
                                    key={opt}
                                    className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${integration === opt ? "text-purple-700 font-semibold" : ""}`}
                                    onClick={() => { setIntegration(opt); setShowDropdown(false); }}
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-10">
                <button
                  type="button"
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-lg font-medium flex items-center gap-2
                    ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
                    text-white`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">↻</span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}