import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import STLViewer from '../ThreeD/STLViewer';

const QAModelVersionHistory = ({ model, onClose }) => {
  const { loading } = useSelector(state => state.modeldata);

  // state to track stl file viewer
  const [selectedFilePath, setSelectedFilePath] = useState(null);

  if (!model) return null;

  const handleFileClick = (filePath) => {
    setSelectedFilePath(filePath);
  };

  const handleCloseViewer = () => {
    setSelectedFilePath(null);
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-[28rem] bg-gray-50 border-l border-gray-300 shadow-lg flex flex-col z-50">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            QA Version History
          </h2>
          <button
            onClick={onClose}
            aria-label="Close version history"
            className="text-gray-600 hover:text-red-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <table className="w-full text-left text-sm text-gray-700 border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 px-1">Ver</th>
                <th className="py-2 px-1">Label</th>
                <th className="py-2 px-1">Uploaded</th>
                <th className="py-2 px-1">File</th>
                <th className="py-2 px-1">Download</th>
              </tr>
            </thead>
            <tbody>
              {model.versions.map(version => {

                const filename = version.filePath?.split(/[/\\]/).pop();
                const publicUrl = filename
                  ? `http://localhost:8080/uploads/${encodeURIComponent(filename)}`
                  : null;

                return (
                  <tr
                    key={version.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-2 px-1 font-medium">#{version.versionNumber}</td>
                    <td className="py-2 px-1">{version.versionLabel || 'N/A'}</td>
                    <td className="py-2 px-1">
                      {new Date(version.timestamp).toLocaleDateString()}
                    </td>
                    <td
                      className="py-2 px-1 text-blue-700 truncate max-w-[100px] cursor-pointer underline"
                      title="Click to view STL model"
                      onClick={() => {
                        if (publicUrl) handleFileClick(publicUrl);
                      }}
                    >
                      {filename}
                    </td>
                    <td className="py-2 px-1">
                      <a
                        href={`http://localhost:8080/api/modeldata/versions/${version.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {model.versions.some(v => v.description || v.dimensions) && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Version Details</h3>
              {model.versions.map(v => (
                (v.description || v.dimensions) && (
                  <div key={v.id} className="mb-3 text-sm text-gray-800 bg-white p-2 rounded border">
                    <p className="font-medium mb-1">Version #{v.versionNumber}</p>
                    {v.description && (
                      <p style={{ whiteSpace: 'pre-wrap' }}>
                        <strong>Description:</strong> {v.description}
                      </p>
                    )}
                    {v.dimensions && (
                      <p>
                        <strong>Dimensions:</strong> {v.dimensions}
                      </p>
                    )}
                  </div>
                )
              ))}

            </div>
          )}
        </div>
      </div>

      {selectedFilePath && (
        <STLViewer filePath={selectedFilePath} onClose={handleCloseViewer} />
      )}
    </>
  );
};

export default QAModelVersionHistory;
