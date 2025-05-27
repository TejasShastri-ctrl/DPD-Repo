import React, { useState } from 'react';

const QAResponse = ({ onClose, onSubmit }) => {
  const [remarks, setRemarks] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!remarks.trim() || !file) {
      alert('Please provide both remarks and a file.');
      return;
    }

    // Submit plain file and remarks object
    onSubmit({ file, remarks });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[30rem] p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Reject Model Version
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks (QARemarks)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows="4"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
              placeholder="Provide detailed reason for rejection"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Remarks File (QAFilePath)
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              required
              className="block w-full text-sm text-gray-800"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Reject Version
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QAResponse;
