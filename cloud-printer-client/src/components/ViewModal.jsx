export default function ViewModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 min-w-[320px] relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-purple-600" onClick={onClose}>✕</button>
        <div className="flex items-center gap-3 mb-4">
          <img src={order.client.avatar} alt="" className="w-12 h-12 rounded-full" />
          <div>
            <div className="font-bold text-lg">{order.client.name}</div>
            <div className="text-xs text-gray-400">{order.client.url}</div>
          </div>
        </div>
        <div className="mb-2"><b>Order ID:</b> {order.orderId}</div>
        <div className="mb-2"><b>Date:</b> {order.date}</div>
        <div className="mb-2"><b>Status:</b> {order.status}</div>
        <div className="mb-2"><b>Integration:</b> {order.integration}</div>
        <div className="mb-2"><b>Forwarded:</b> {order.forwarded ? "Yes" : "No"}</div>
      </div>
    </div>
  );
}