import React from "react";

export default function SuccessAlert({ open, message }) {
  if (!open) return null;
  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow">
        <strong className="font-bold">Success! </strong>
        <span>{message}</span>
      </div>
    </div>
  );
}