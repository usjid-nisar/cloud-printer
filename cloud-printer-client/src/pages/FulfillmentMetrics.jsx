import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getFulfillmentMetrics } from "../services/order";

function StatCard({ title, value, sub, trend, trendText, chart }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[220px]">
      <div className="text-gray-500 font-medium mb-2">{title}</div>
      <div className="flex items-end gap-2">
        <div className="text-3xl font-bold">{value}</div>
        {sub && <span className="ml-2 text-lg text-gray-400">{sub}</span>}
        {trend !== undefined && (
          <div className={`flex items-center text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-1">{trendText}</div>
      {chart && <div className="mt-2">{chart}</div>}
    </div>
  );
}

function CircularProgress({ percent, label, value, color = "#8b5cf6" }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="120" height="120" className="mx-auto block">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth="12" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s" }}
      />
      <text x="60" y="60" textAnchor="middle" dy="0.3em" fontSize="1.5rem" fill="#7c3aed" fontWeight="bold">
        {value}
      </text>
      <text x="60" y="80" textAnchor="middle" fontSize="0.9rem" fill="#888">{label}</text>
    </svg>
  );
}

export default function FulfillmentMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
    endDate: new Date()
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFulfillmentMetrics(dateRange.startDate, dateRange.endDate);
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin text-purple-600">↻</div>
              <span className="ml-2">Loading metrics...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="bg-red-50 text-red-600 p-4 rounded">
              {error}
              <button 
                onClick={() => setDateRange({ ...dateRange })} // Trigger refetch
                className="ml-2 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Fulfillment Metrics</h1>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.startDate.toISOString().split('T')[0]}
                onChange={(e) => setDateRange(prev => ({ 
                  ...prev, 
                  startDate: new Date(e.target.value)
                }))}
                className="border rounded px-3 py-2"
              />
              <input
                type="date"
                value={dateRange.endDate.toISOString().split('T')[0]}
                onChange={(e) => setDateRange(prev => ({ 
                  ...prev, 
                  endDate: new Date(e.target.value)
                }))}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Top Stats */}
          <div className="flex gap-6 mb-8 flex-wrap">
            <StatCard
              title="Average Fulfillment Time"
              value={`${metrics.avgFulfillmentTime} Days`}
              trend={metrics.fulfillmentTimeTrend}
              trendText="vs. Previous Period"
              chart={
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
                  <path 
                    d="M0 20 Q 20 10, 40 20 T 80 10" 
                    stroke={metrics.fulfillmentTimeTrend > 0 ? "#ef4444" : "#22c55e"} 
                    strokeWidth="2" 
                    fill="none" 
                  />
                </svg>
              }
              sub={<span className="text-xs text-gray-400">Time from order to shipment</span>}
            />
            <StatCard
              title="Success Rate"
              value={`${metrics.successRate}%`}
              trend={metrics.successRateTrend}
              trendText="vs. Previous Period"
              chart={
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
                  <path 
                    d="M0 20 Q 20 10, 40 20 T 80 10" 
                    stroke={metrics.successRateTrend > 0 ? "#22c55e" : "#ef4444"} 
                    strokeWidth="2" 
                    fill="none" 
                  />
                </svg>
              }
            />
            <StatCard
              title="Total vs Failed Orders"
              value={metrics.totalOrders}
              sub={<span className="ml-6 text-2xl text-gray-400">{metrics.failedOrders}</span>}
              trendText={<span className="flex gap-8"><span>Total Orders</span><span>Failed Orders</span></span>}
            />
          </div>

          {/* Circular Progress */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Processing</h2>
            <div className="bg-white rounded-xl shadow p-6 flex flex-wrap gap-8">
              <div className="flex-1 min-w-[220px]">
                <div className="font-medium mb-2">Orders Processing</div>
                <CircularProgress 
                  percent={metrics.routedPercentage} 
                  value={`${Math.round(metrics.routedPercentage)}%`} 
                  label="Routed to Cloudprinter" 
                />
              </div>
              <div className="flex-1 min-w-[220px]">
                <div className="font-medium mb-2">&nbsp;</div>
                <CircularProgress 
                  percent={metrics.selfProducedPercentage} 
                  value={`${Math.round(metrics.selfProducedPercentage)}%`} 
                  label="Self Produced" 
                />
              </div>
              <div className="flex-1 min-w-[220px]">
                <div className="font-medium mb-2">&nbsp;</div>
                <svg width="120" height="120" className="mx-auto block">
                  {/* Outer: Total Orders */}
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#ede9fe" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - metrics.totalOrdersPercentage / 100)}
                    strokeLinecap="round"
                  />
                  {/* Middle: Completed */}
                  <circle cx="60" cy="60" r="36" fill="none" stroke="#ede9fe" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="36"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 36}
                    strokeDashoffset={2 * Math.PI * 36 * (1 - metrics.completedOrdersPercentage / 100)}
                    strokeLinecap="round"
                  />
                  {/* Inner: Active */}
                  <circle cx="60" cy="60" r="24" fill="none" stroke="#ede9fe" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="24"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - metrics.activeOrdersPercentage / 100)}
                    strokeLinecap="round"
                  />
                  <text x="60" y="60" textAnchor="middle" dy="0.3em" fontSize="1.5rem" fill="#7c3aed" fontWeight="bold">
                    {metrics.totalOrders}
                  </text>
                  <text x="60" y="80" textAnchor="middle" fontSize="0.9rem" fill="#888">Total Orders</text>
                </svg>
                <div className="flex flex-col items-center mt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>
                    Active {metrics.activeOrders}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-300 inline-block"></span>
                    Completed {metrics.completedOrders}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-700 inline-block"></span>
                    Total Orders {metrics.totalOrders}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}