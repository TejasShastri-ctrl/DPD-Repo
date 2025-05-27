import React from 'react';

const ModelDataCard = ({ model, onSelect, onMarkUnderScrutiny }) => {
  if (!model) return null;

  const {
    id,
    name,
    createdAt,
    updatedAt,
    currentVersion,
    status,
  } = model;

  const getFileName = (filePath) => {
    if (!filePath) return 'N/A';
    return filePath.split(/[\\/]/).pop();
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return '#';
    return filePath.startsWith('http') ? filePath : `http://localhost:8080/${filePath}`;
  };

  const isPushable = status !== 'APPROVED';
  const isPushed = status == 'UNDER_SCRUTINY';

  return (
    <div
      onClick={() => onSelect(model.id)}
      className={`
        max-w-md w-full rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300
        ${status === 'APPROVED' ? 'bg-green-100 border-green-600' : 'bg-white border-gray-300'}
      `}
    >
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">{name}</h2>

      <p className="text-gray-600 mb-1">
        <span className="font-semibold text-gray-700">Status:</span>{' '}
        <span
          className={
            status === 'APPROVED'
              ? 'text-green-600'
              : status === 'SENT_BACK'
              ? 'text-red-600'
              : status === 'UNDER_SCRUTINY'
              ? 'text-yellow-600'
              : 'text-gray-700'
          }
        >
          {status}
        </span>
      </p>

      <p className="text-gray-600 mb-1">
        <span className="font-semibold text-gray-700">Created:</span>{' '}
        {new Date(createdAt).toLocaleString()}
      </p>

      <p className="text-gray-600 mb-4">
        <span className="font-semibold text-gray-700">Last Updated:</span>{' '}
        {new Date(updatedAt).toLocaleString()}
      </p>

      {currentVersion && (
        <div className="bg-gray-50 rounded-md border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
            Current Version
          </h3>

          <p className="text-gray-700 mb-1">
            <span className="font-medium">Version #:</span> {currentVersion.versionNumber}
          </p>

          <p className="text-gray-700 mb-1">
            <span className="font-medium">Label:</span>{' '}
            {currentVersion.versionLabel || 'N/A'}
          </p>

          <p className="text-gray-700 mb-2">
            <span className="font-medium">Timestamp:</span>{' '}
            {new Date(currentVersion.timestamp).toLocaleString()}
          </p>

          <p>
            <span className="font-medium text-gray-700">File:</span>{' '}
            <a
              href={getFileUrl(currentVersion.filePath)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-words"
              onClick={(e) => e.stopPropagation()}
              title="Open file in new tab"
            >
              {getFileName(currentVersion.filePath)}
            </a>
          </p>
        </div>
      )}

      {isPushable && !isPushed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkUnderScrutiny(id);
          }}
          className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition-colors"
        >
          Push Model
        </button>
      )}
    </div>
  );
};

export default ModelDataCard;
