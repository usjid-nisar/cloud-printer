import React, { useState } from "react";
import BrandingDetailsForm from "./BrandingDetailsForm";
import { createClient } from "../services/client";
import SuccessAlert from "./SuccessAlert";

export default function AddClientModal({ open, onClose, onClientAdded }) {
  const [showBranding, setShowBranding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [brandingData, setBrandingData] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    domain: "",
    resellerApiKey: "",
    printPartnerApiKey: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const clientData = {
        ...form,
        brandingData,
      };
      
      const result = await createClient(clientData);
      setSuccess(true);
      onClientAdded?.(result);
      
      // Reset form after successful submission
      setTimeout(() => {
        setForm({
          email: "",
          password: "",
          domain: "",
          resellerApiKey: "",
          printPartnerApiKey: "",
        });
        setBrandingData(null);
        setShowBranding(false);
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandingSubmit = (data) => {
    setBrandingData(data);
    setShowBranding(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: "rgba(105,65,198,0.85)" }}
    >
      <div
        className="bg-white border rounded-lg shadow-lg relative flex flex-col"
        style={{
          width: "1100px",
          minHeight: showBranding ? "900px" : "500px",
          padding: "24px",
          gap: "20px",
        }}
      >
        {/* Close Icon */}
        <button
          className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-6">Add new client account</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <SuccessAlert message="Client added successfully!" />
        )}
        
        <form
          className="flex flex-col gap-5 flex-1"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center">
            <label className="block font-semibold w-56">Client Email ID</label>
            <input
              className="flex-1 border rounded px-3 py-2"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center">
            <label className="block font-semibold w-56">Set Password</label>
            <input
              className="flex-1 border rounded px-3 py-2"
              type="password"
              placeholder="********"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center">
            <label className="block font-semibold w-56">Client Domain</label>
            <input
              className="flex-1 border rounded px-3 py-2"
              type="text"
              placeholder="http://   www.untitledui.com"
              value={form.domain}
              onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center">
            <label className="block font-semibold w-56">Add Reseller API Key</label>
            <input
              className="flex-1 border rounded px-3 py-2"
              type="text"
              placeholder="Enter API key"
              value={form.resellerApiKey}
              onChange={e => setForm(f => ({ ...f, resellerApiKey: e.target.value }))}
            />
          </div>
          <div className="flex items-center">
            <label className="block font-semibold w-56">Add Print-Partner API Key</label>
            <input
              className="flex-1 border rounded px-3 py-2"
              type="text"
              placeholder="Enter API key"
              value={form.printPartnerApiKey}
              onChange={e => setForm(f => ({ ...f, printPartnerApiKey: e.target.value }))}
            />
          </div>
          <div className="border-t pt-4 flex items-center">
            <div className="w-56">
              <div className="font-semibold">Branding</div>
              <div className="text-gray-500 text-sm">Add client logo and company details here.</div>
            </div>
            <button
              type="button"
              className={`flex-1 px-4 py-2 rounded flex items-center justify-center gap-2 font-semibold ${
                brandingData 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100'
              }`}
              onClick={() => setShowBranding(true)}
              disabled={showBranding}
            >
              {brandingData ? (
                <>Branding Details Added ✓</>
              ) : (
                <>Add Branding Details <span className="text-xl">+</span></>
              )}
            </button>
          </div>
          {showBranding && (
            <BrandingDetailsForm 
              onClose={() => setShowBranding(false)}
              onSubmit={handleBrandingSubmit}
              initialData={brandingData}
            />
          )}
          <div className="flex justify-end mt-auto gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 flex items-center gap-2 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin">↻</span>
                  Adding Client...
                </>
              ) : (
                'Add Client'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}