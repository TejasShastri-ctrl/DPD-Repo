import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchModeldataVersions, clearSelectedModel } from '../Redux/Modeldata/ModeldataSlice';

const ModelDataDetail = () => {
  const dispatch = useDispatch();
  const selectedModel = useSelector(state => state.modeldata.selectedModel);
  const versionHistory = useSelector(state => state.modeldata.versionHistory);
  const loading = useSelector(state => state.modeldata.loading);
  const error = useSelector(state => state.modeldata.error);

  let BASEURL = "http://localhost:8080";

  useEffect(() => {
    if (selectedModel) {
      dispatch(fetchModeldataVersions(selectedModel.id));
    }

    return () => dispatch(clearSelectedModel());
  }, [dispatch, selectedModel]);

  if (!selectedModel) return <p>Select a model to see details</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-300">
      <h1 className="text-3xl font-bold mb-4">{selectedModel.name}</h1>
      <p>Status: {selectedModel.status}</p>
      <p>Created: {new Date(selectedModel.createdAt).toLocaleString()}</p>
      <p>Updated: {new Date(selectedModel.updatedAt).toLocaleString()}</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Version History</h2>
      {loading && <p>Loading versions...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-4">
        {model.versions.map(version => (
          <li
            key={version.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <p className="text-lg font-semibold text-gray-800">
              Version {version.versionNumber} — <span className="text-gray-600">{version.versionLabel}</span>
            </p>

            <p className="text-sm text-gray-600 mt-1">
              Uploaded: {new Date(version.timestamp).toLocaleString()}
            </p>

            {version.description && (
              <p className="text-sm text-gray-700 mt-1">
                Description: {version.description}
              </p>
            )}

            <p className="text-sm text-blue-700 mt-1">
              File:{" "}
              <a
                href={`${BASEURL}/api/modeldata/versions/${version.id}/download`}
                className="underline text-blue-600 hover:text-blue-800"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                {version.filePath?.split('\\').pop() || 'Download'}
              </a>
            </p>

          </li>
        ))}
      </ul>

    </div>
  );
};

export default ModelDataDetail;
