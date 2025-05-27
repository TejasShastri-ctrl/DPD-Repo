import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchModeldataUnderScrutiny,
  setSelectedModel,
  clearSelectedModel,
  fetchModeldataVersions,
  markModeldataApproved,
  markModeldataSentBack,
  fetchAllModeldata
} from '../Redux/Modeldata/ModeldataSlice';

import QAModelDataCard from '../components/QAModelDataCard';
import ModelVersionHistory from '../components/ModelVersionHistory';
import QAModelVersionHistory from '../components/QAModelVersionHistory';

const STATUSES = {
  UNDER_SCRUTINY: 'UNDER_SCRUTINY',
  SENT_BACK: 'SENT_BACK',
  APPROVED: 'APPROVED',
};

function QADashboard() {
  const dispatch = useDispatch();
  const { list: models, selectedModel, versionHistory, loading, error } = useSelector(
    (state) => state.modeldata
  );

  const [filter, setFilter] = useState(STATUSES.UNDER_SCRUTINY);

  useEffect(() => {
    dispatch(fetchAllModeldata());
  }, [dispatch]);

  const onSelectModel = (modelId) => {
    const model = models.find((m) => m.id === modelId);
    if (model) {
      dispatch(setSelectedModel(model));
      dispatch(fetchModeldataVersions(modelId));
    }
  };

  const handleCloseVersionHistory = () => {
    dispatch(clearSelectedModel());
  };

  const handleApprove = (modelId) => {
    dispatch(markModeldataApproved(modelId));
  };

  const handleReject = (modelId) => {
    dispatch(markModeldataSentBack(modelId));
  };

  const filteredModels = models.filter((model) => model.status === filter);

  return (
    <div className="p-3">
      <h1 className="text-3xl font-bold mb-6">QA Dashboard</h1>

      <div className="mb-6 flex flex-wrap gap-3">
        {Object.entries(STATUSES).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded font-medium border ${
              filter === value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
          >
            {value.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading && <p>Loading models...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && filteredModels.length === 0 && <p>No models match the selected status.</p>}

      <div className="flex flex-col gap-6">
  {filteredModels.map((model) => (
    <QAModelDataCard
      key={model.id}
      model={model}
      onSelect={onSelectModel}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  ))}
</div>


      {selectedModel && (
        <section className="mt-8">
          <QAModelVersionHistory
            model={{ ...selectedModel, versions: versionHistory }}
            onClose={handleCloseVersionHistory}
          />
        </section>
      )}
    </div>
  );
}

export default QADashboard;
