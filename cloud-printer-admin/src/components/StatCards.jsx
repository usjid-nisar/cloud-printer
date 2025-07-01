import { Sparklines, SparklinesLine, SparklinesCurve } from "react-sparklines";

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-between">
        <span className="text-gray-500 font-medium">Existing Clients</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-4xl font-bold">1,200</span>
          <div className="w-28 h-12">
            <Sparklines data={[900, 950, 1000, 1100, 1200]} width={100} height={40} margin={5}>
              {/* Smooth curve */}
              <SparklinesCurve
                color="#22c55e"
                style={{ strokeWidth: 3, fill: "none", filter: "drop-shadow(0 2px 4px #22c55e33)" }}
              />
            </Sparklines>
          </div>
        </div>
        <span className="text-green-500 mt-1 text-sm">▲ 40% This week</span>
      </div>
      <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-between">
        <span className="text-gray-500 font-medium">New Client Requests</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-4xl font-bold">15</span>
          <div className="w-28 h-12">
            <Sparklines data={[20, 18, 17, 16, 15]} width={100} height={40} margin={5}>
              <SparklinesCurve
                color="#ef4444"
                style={{ strokeWidth: 3, fill: "none", filter: "drop-shadow(0 2px 4px #ef444433)" }}
              />
            </Sparklines>
          </div>
        </div>
        <span className="text-red-500 mt-1 text-sm">▼ 10% This week</span>
      </div>
    </div>
  );
}