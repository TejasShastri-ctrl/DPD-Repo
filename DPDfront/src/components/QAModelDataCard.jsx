import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import QAResponse from './QAResponse';
import { rejectModeldataVersion } from '../Redux/Modeldata/ModeldataSlice';

const QAModelDataCard = ({ model, onSelect, onApprove }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  if (!model) return null;

  const {
    id,
    name,
    createdAt,
    updatedAt,
    currentVersion,
    status,
    appuser,
    appUsername,
  } = model;

  const getFileName = (filePath) => {
    if (!filePath) return 'N/A';
    return filePath.split(/[\\/]/).pop();
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return '#';
    return filePath.startsWith('http') ? filePath : `http://localhost:8080/${filePath}`;
  };

  const username = appUsername || 'Default User';
  const isActionable = status === 'UNDER_SCRUTINY';

  const statusColors = {
    APPROVED: 'bg-green-600 text-green-100',
    SENT_BACK: 'bg-red-600 text-red-100',
    UNDER_SCRUTINY: 'bg-yellow-500 text-yellow-900',
    DEFAULT: 'bg-gray-700 text-gray-300',
  };

  const statusClass = statusColors[status] || statusColors.DEFAULT;

  // Updated handler to take plain file and remarks, not a FormData object
  const handleRejectSubmit = async ({ file, remarks }) => {
    try {
      await dispatch(
        rejectModeldataVersion({
          versionId: currentVersion.id,
          modeldataId: model.id,
          remarks,
          file,
        })
      ).unwrap();
      setShowModal(false);
    } catch (error) {
      alert('Failed to reject version: ' + (error.message || error));
    }
  };

  return (
    <>
      <div
        onClick={() => onSelect(model.id)}
        className={`flex w-full rounded-lg shadow-md cursor-pointer overflow-hidden
          border ${status === 'APPROVED' ? 'border-green-600 bg-green-900' : 'border-gray-700 bg-gray-900'}
          hover:shadow-xl transition-shadow duration-300 text-white`}
        style={{ minHeight: 140 }}
      >
        <div className="flex flex-col flex-grow p-6 gap-3">
          <h2 className="text-xl font-extrabold tracking-wide truncate">{name}</h2>
          <div className="flex gap-8 text-sm text-gray-300">
            <div><span className="font-semibold">Submitted By:</span> {username}</div>
            <div><span className="font-semibold">Created:</span> {new Date(createdAt).toLocaleDateString()}</div>
            <div><span className="font-semibold">Updated:</span> {new Date(updatedAt).toLocaleDateString()}</div>
          </div>

          {currentVersion && (
            <div className="bg-gray-800 rounded-md border border-gray-700 p-3 text-xs max-w-md overflow-hidden">
              <h3 className="font-semibold mb-1 border-b border-gray-600 pb-0.5">Current Version</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-medium">Version #:</span> {currentVersion.versionNumber}</div>
                <div><span className="font-medium">Label:</span> {currentVersion.versionLabel || 'N/A'}</div>
                <div><span className="font-medium">Timestamp:</span> {new Date(currentVersion.timestamp).toLocaleString()}</div>
                <div className="truncate">
                  <span className="font-medium">File:</span>{' '}
                  <a
                    href={getFileUrl(currentVersion.filePath)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline break-words"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getFileName(currentVersion.filePath)}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between p-4 w-48 bg-gray-800 border-l border-gray-700">
          <div>
            <div className={`inline-block px-3 py-1 rounded-full text-center font-semibold tracking-wide ${statusClass}`}>
              {status}
            </div>
          </div>

          {isActionable && (
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(id);
                }}
                className="w-full px-3 py-2 bg-green-600 rounded hover:bg-green-700 font-semibold transition-colors"
              >
                Approve
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(currentVersion?.id || id);
                  setShowModal(true);
                }}
                className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700 font-semibold transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <QAResponse
          versionId={selectedId}
          onClose={() => setShowModal(false)}
          onSubmit={handleRejectSubmit} // Accepts ({file, remarks})
        />
      )}
    </>
  );
};

export default QAModelDataCard;
