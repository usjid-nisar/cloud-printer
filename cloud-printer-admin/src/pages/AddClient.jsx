import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddClient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    domain: "",
    branding: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Client added! (Stub)");
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-[#6C47FF]/80 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg w-[600px] p-8 relative"
      >
        <button
          type="button"
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
          onClick={() => navigate("/")}
        >
          <span className="material-icons">close</span>
        </button>
        <h2 className="text-xl font-bold mb-6">Add new client account</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Client Email ID</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full border rounded-lg px-4 py-2"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Set Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            className="w-full border rounded-lg px-4 py-2"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Client Domain</label>
          <input
            type="text"
            name="domain"
            placeholder="http://www.untitledui.com"
            className="w-full border rounded-lg px-4 py-2"
            value={form.domain}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1">Branding</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="branding"
              placeholder="Add client logo and company details here."
              className="flex-1 border rounded-lg px-4 py-2"
              value={form.branding}
              onChange={handleChange}
            />
            <button
              type="button"
              className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => alert("Add Branding Details (Stub)")}
            >
              Add Branding Details
              <span className="material-icons text-base">add</span>
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-5 py-2 rounded-lg border"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#6C47FF] text-white px-5 py-2 rounded-lg"
          >
            Add Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;