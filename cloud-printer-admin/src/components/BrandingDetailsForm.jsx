import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

export default function BrandingDetailsForm({ onClose }) {
  const [companyName, setCompanyName] = useState("Cloud Printer");
  const [email, setEmail] = useState("olivia@untitledui.com");
  const [logo, setLogo] = useState(null);
  const [primaryColor, setPrimaryColor] = useState("#B692F6");
  const [secondaryColor, setSecondaryColor] = useState("#0D141C");
  const [buttonColor, setButtonColor] = useState("#7F56D9");
  const [font, setFont] = useState("Inter");

  // Handle file upload
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="pt-6">
      <div className="grid grid-cols-2 gap-8">
        {/* Left column */}
        <div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Company Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Cloud Printer"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Email address</label>
            <div className="flex items-center border rounded px-3 py-2 bg-white">
              <span className="mr-2 text-gray-400">@</span>
              <input
                className="flex-1 outline-none"
                placeholder="olivia@untitledui.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Upload Company Logo</label>
            <div className="text-xs text-gray-500 mb-2">This will be displayed on your invoice</div>
            <label className="w-full border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer hover:border-purple-400 transition">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              {logo ? (
                <img src={logo} alt="Logo" className="w-16 h-16 rounded-full object-cover mb-2" />
              ) : (
                <FiUploadCloud className="text-4xl text-gray-400 mb-2" />
              )}
              <span className="text-purple-600 font-semibold">Click to upload</span>
              <span className="text-xs text-gray-400 mt-1">or drag and drop</span>
              <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</span>
            </label>
          </div>
        </div>
        {/* Right column */}
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Primary Color */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Select Primary/Banner Color</label>
              <div className="flex items-center mb-1">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 border rounded mr-2"
                />
                <input
                  className="border rounded px-3 py-2 w-32"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                />
                <button
                  className="ml-4 px-4 py-2 rounded"
                  style={{ background: primaryColor, color: "#fff" }}
                >
                  Banner
                </button>
              </div>
              <div className="text-xs text-gray-500">This will be used on your invoice banner</div>
            </div>
            {/* Secondary Color */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Select Secondary Color</label>
              <div className="flex items-center mb-1">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 border rounded mr-2"
                />
                <input
                  className="border rounded px-3 py-2 w-32"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                />
                <span className="ml-4 text-gray-700">Text color will look like this</span>
              </div>
              <div className="text-xs text-gray-500">This will be used for paragraph text</div>
            </div>
            {/* Button Color */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Select Button Color</label>
              <div className="flex items-center mb-1">
                <input
                  type="color"
                  value={buttonColor}
                  onChange={e => setButtonColor(e.target.value)}
                  className="w-10 h-10 border rounded mr-2"
                />
                <input
                  className="border rounded px-3 py-2 w-32"
                  value={buttonColor}
                  onChange={e => setButtonColor(e.target.value)}
                />
                <button
                  className="ml-4 px-4 py-2 rounded"
                  style={{ background: buttonColor, color: "#fff" }}
                >
                  Submit
                </button>
              </div>
              <div className="text-xs text-gray-500">This will be used on buttons</div>
            </div>
            {/* Font */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Select Font</label>
              <div className="flex items-center mb-1">
                <select
                  className="border rounded px-3 py-2 w-32"
                  value={font}
                  onChange={e => setFont(e.target.value)}
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Arial">Arial</option>
                </select>
                <span className="ml-4 font-semibold">Selected Font <span className="font-bold">{font}</span></span>
              </div>
              <div className="text-xs text-gray-500">Text font style will look like this</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
} 