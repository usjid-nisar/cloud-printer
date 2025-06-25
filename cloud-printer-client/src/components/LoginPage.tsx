import React from 'react';
import bgImage from '../assets/login_bg.png';
const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-purple-700 to-purple-400 relative">
        <div className="bg-white rounded-lg shadow-lg p-10 w-[350px]">
          <div className="flex items-center justify-center mb-6">
            <span className="text-3xl font-bold text-purple-700">C</span>
            <span className="text-xl font-bold ml-2 text-gray-800">Cloudprinter</span>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-2">Log in</h2>
          <p className="text-sm text-center text-gray-500 mb-6">Enter your account details.</p>

          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="mr-2" />
                Remember for 30 days
              </label>
              <a href="#" className="text-sm text-purple-600 hover:underline">
                Forgot password
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md"
            >
              Submit
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-6">©2025 CloudPrinter.</p>
        </div>

      </div>

      {/* Right Side - Image */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
    </div>
  );
};

export default LoginPage;
