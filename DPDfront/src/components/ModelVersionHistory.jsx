import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addModeldataVersion } from '../Redux/Modeldata/ModeldataSlice';
import AddVersionCard from './AddVersionCard';
import STLViewer from '../ThreeD/STLViewer';

const ModelVersionHistory = ({ model, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.modeldata);
  const [showAddVersionCard, setShowAddVersionCard] = useState(false);

  //! New state for showing STLViewer
  const [selectedFilePath, setSelectedFilePath] = useState(null);

  if (!model) return null;

  const handleAddVersion = async ({ file, description, dimensions }) => {
    try {
      await dispatch(addModeldataVersion({
        modeldataId: model.id,
        file,
        description,
        dimensions,
      })).unwrap();

      setShowAddVersionCard(false);
    } catch (err) {
      console.error('Failed to add new version:', err);
    }
  };

  // Handler to open STLViewer
  const handleFileClick = (filePath) => {
    setSelectedFilePath(filePath);
  };

  // Handler to close STLViewer
  const handleCloseViewer = () => {
    setSelectedFilePath(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-300">

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl"
            onClick={onClose}
            aria-label="Close version history"
          >
            &times;
          </button>

          {/* Header and Add Button */}
          <div className="px-6 pt-6 mx-10 pb-4 border-b border-gray-200 flex justify-between items-center relative">
            <h2 className="text-3xl font-semibold text-gray-800">
              Version History for {model.name}
            </h2>
            <button
              onClick={() => setShowAddVersionCard(prev => !prev)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              aria-expanded={showAddVersionCard}
              aria-controls="add-version-card"
            >
              {showAddVersionCard ? 'Close Form' : 'Push New Version'}
            </button>

            {/* AddVersionCard */}
            {showAddVersionCard && (
              <AddVersionCard
                onSubmit={handleAddVersion}
                onCancel={() => setShowAddVersionCard(false)}
                loading={loading}
              />
            )}
          </div>

          {/* Version List */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
            <ul className="space-y-4">
              {model.versions.map(version => (
                <li
  key={version.id}
  className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
>
  <p className="text-lg font-medium">
    Version #{version.versionNumber}{' '}
    <span className="text-sm text-gray-500">
      ({version.versionLabel || 'N/A'})
    </span>
  </p>

  <p className="text-sm text-gray-600 mt-1">
    Uploaded: {new Date(version.timestamp).toLocaleString()}
  </p>

  {/* Clickable original file */}
  <p
    onClick={() => {
      const filename = version.filePath.split(/[/\\]/).pop();
      const publicUrl = `http://localhost:8080/uploads/${encodeURIComponent(filename)}`;
      handleFileClick(publicUrl);
    }}
    className="text-sm text-blue-700 mt-1 cursor-pointer underline"
    title="Click to view STL model"
  >
    File: {version.filePath?.split('\\').pop()}
  </p>

  {version.description && (
    <p className="text-sm text-gray-700 mt-1" style={{whiteSpace: 'pre-wrap'}}>
      Description: {version.description}
    </p>
  )}

  {version.dimensions && (
    <p className="text-sm text-gray-700 mt-1">
      Dimensions: {version.dimensions}
    </p>
  )}

  {/* QA Remarks */}
  {version.qaremarks && (
    <p className="text-sm text-amber-700 mt-2 font-semibold" style={{whiteSpace: 'pre-wrap'}}>
      QA Remarks: {version.qaremarks}
    </p>
  )}

  {/* QA File Path */}
  {version.qafilePath ? (
  (() => {
    const filename = version.qafilePath.split(/[/\\]/).pop();
    const publicUrl = `http://localhost:8080/uploads/${encodeURIComponent(filename)}`;
    return (
      <a
  href={`http://localhost:8080/api/modeldata/versions/${version.id}/downloadQA`}
  className="text-sm text-purple-700 mt-1 underline"
  title="Download QA report PDF"
  download
>
  QA File: {filename}
</a>


    );
  })()
) : (
  <p className="text-sm text-gray-500 mt-1">QA File: N/A</p>
)}


  <div className="mt-2">
    <a
      href={`http://localhost:8080/api/modeldata/versions/${version.id}/download`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
    >
      Download Version File
    </a>
  </div>
</li>

              ))}
            </ul>
          </div>
        </div>
      </div>

      {selectedFilePath && (
        <STLViewer filePath={selectedFilePath} onClose={handleCloseViewer} />
      )}
    </>
  );
};

export default ModelVersionHistory;
