import React, { useState } from 'react';

const AddVersionCard = ({ onSubmit, onCancel, loading }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('');

  const handleSubmit = () => {
    if (!file || !description || !dimensions) {
      alert('Please provide file, description, and dimensions');
      return;
    }
    onSubmit({ file, description, dimensions });
  };

  return (
    <div className="absolute top-20 right-8 z-50 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Add New Version</h3>

      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
        className="border rounded p-2 w-full mb-4"
        aria-label="Select file for new version"
        accept=".pdf,.txt"
      />

      <textarea
        placeholder="Version Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border rounded p-2 w-full mb-4 resize-none"
        rows={3}
        aria-label="Version description"
      />

      <input
        type="text"
        placeholder="Dimensions (e.g., 200x100x50 mm)"
        value={dimensions}
        onChange={e => setDimensions(e.target.value)}
        className="border rounded p-2 w-full mb-4"
        aria-label="Model dimensions"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!file || !description || !dimensions || loading}
          className={`px-4 py-2 rounded text-white ${
            !file || !description || !dimensions || loading
              ? 'bg-green-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Uploading...' : 'Push Version'}
        </button>
      </div>
    </div>
  );
};

export default AddVersionCard;
