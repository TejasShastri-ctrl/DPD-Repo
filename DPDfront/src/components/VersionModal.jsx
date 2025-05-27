import React from 'react';

function VersionModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">{product.name} - Version History</h2>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {product.versions.map((v, index) => (
            <li key={index} className="text-sm text-gray-700">
              <strong>Version:</strong> {v.version}<br />
              <strong>Updated By:</strong> {v.updatedBy}<br />
              <strong>Date:</strong> {v.date}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default VersionModal;
