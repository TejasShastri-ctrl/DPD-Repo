import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchModeldataByUserId,
    fetchModeldataVersions,
    createNewModeldata,
    addModeldataVersion,
    setSelectedModel,
    clearSelectedModel,
    markModeldataUnderScrutiny
} from '../Redux/Modeldata/ModeldataSlice';
import ModelDataCard from '../components/ModelDataCard';
import ModelVersionHistory from '../components/ModelVersionHistory';

function ProductionDashboard() {
    const dispatch = useDispatch();
    const authUser = useSelector(state => state.auth.user);
    const { list: models, selectedModel, versionHistory, loading, error } = useSelector(state => state.modeldata);

    const [newModelName, setNewModelName] = useState('');
    const [newModelFile, setNewModelFile] = useState(null);
    const [uploadVersionFile, setUploadVersionFile] = useState(null);
    const [newModelType, setNewModelType] = useState('');
    const [newModelDescription, setNewModelDescription] = useState('');
    const [uploadVersionDescription, setUploadVersionDescription] = useState('');

    const [showCreateForm, setShowCreateForm] = useState(false);




    const handleCloseVersionHistory = () => {
        dispatch(clearSelectedModel());
    };


    useEffect(() => {
        if (authUser?.id) {
            dispatch(fetchModeldataByUserId(authUser.id));
        }
    }, [authUser, dispatch]);

    const [filter, setFilter] = useState('CREATED'); // default filter

    const filteredModels = models.filter(model => {
        switch (filter) {
            case 'created':
                return model.status === 'CREATED';
            case 'under_scrutiny':
                return model.status === 'UNDER_SCRUTINY';
            case 'rejected':
                return model.status === 'SENT_BACK';
            case 'approved':
                return model.status === 'APPROVED';
            default:
                return true;
        }
    });

    const onSelectModel = (model) => {
        dispatch(setSelectedModel(model));
        dispatch(fetchModeldataVersions(model.id));
    };

    const handleMarkUnderScrutiny = (id) => {
    dispatch(markModeldataUnderScrutiny(id));
  };


    const onCreateModel = () => {
        if (!newModelName || !newModelFile || !newModelType || !newModelDescription) {
            alert("Please provide name, file, type, and description.");
            return;
        }

        dispatch(createNewModeldata({
            userId: authUser.id,
            name: newModelName,
            file: newModelFile,
            type: newModelType,
            description: newModelDescription,
        }))
            .unwrap()
            .then(() => {
                setNewModelName('');
                setNewModelFile(null);
                setNewModelType('');
                setNewModelDescription('');
                dispatch(fetchModeldataByUserId(authUser.id));
            })
            .catch(err => alert("Failed to create model: " + err));
    };

    const onAddVersion = async () => {
        if (!selectedModel || !selectedModel.id || !uploadVersionFile || !uploadVersionDescription) {
            alert("Please select a model, upload a file, and provide a description.");
            return;
        }

        try {
            const resultAction = await dispatch(
                addModeldataVersion({
                    modeldataId: selectedModel.id,
                    file: uploadVersionFile,
                    description: uploadVersionDescription,
                })
            );

            if (addModeldataVersion.fulfilled.match(resultAction)) {
                await dispatch(fetchModeldataVersions(selectedModel.id));
                setUploadVersionFile(null);
                setUploadVersionDescription('');
            } else {
                console.error("Upload failed:", resultAction.payload);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };



    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 ">Production Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8">
                {/* Main content area */}
                <div>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            {filter === 'created' && 'Your models'}
                            {filter === 'under_scrutiny' && 'Under Scrutiny'}
                            {filter === 'rejected' && 'Sent Back'}
                            {filter === 'approved' && 'Approved'}
                        </h2>

                        {loading && <p>Loading models...</p>}
                        {error && <p className="text-red-600">{error}</p>}
                        {!loading && filteredModels.length === 0 && <p>No models found for this category.</p>}

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredModels.map(model => (
                                <ModelDataCard
                                    key={model.id}
                                    model={model}
                                    onSelect={() => onSelectModel(model)}
                                    onMarkUnderScrutiny={handleMarkUnderScrutiny}
                                />
                            ))}
                        </div>
                    </section>

                    {showCreateForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">Create New Model</h2>

            <input
                type="text"
                placeholder="Model Name"
                value={newModelName}
                onChange={e => setNewModelName(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-2 w-full"
            />

            <input
                type="text"
                placeholder="Model Type"
                value={newModelType}
                onChange={e => setNewModelType(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-2 w-full"
            />

            <textarea
                placeholder="Model Description"
                value={newModelDescription}
                onChange={e => setNewModelDescription(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-2 w-full"
                rows={3}
            />

            <input
                type="file"
                onChange={e => setNewModelFile(e.target.files[0])}
                accept=".pdf,.txt"
                className="mb-4"
            />

            <div className="flex justify-end gap-3">
                <button
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                    Cancel
                </button>

                <button
                    onClick={onCreateModel}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={!newModelName || !newModelFile || !newModelType || !newModelDescription || loading}
                >
                    Create Model
                </button>
            </div>
        </div>
    </div>
)}


                    {selectedModel && (
                        <section>
                            <ModelVersionHistory model={{ ...selectedModel, versions: versionHistory }} onClose={handleCloseVersionHistory} />

                            <div className="mt-4 max-w-md">
                                <input
                                    type="file"
                                    onChange={e => setUploadVersionFile(e.target.files[0])}
                                    accept=".pdf,.txt"
                                    className="mb-2"
                                    aria-label="Version file upload"
                                />
                                <textarea
                                    placeholder="Version Description"
                                    value={uploadVersionDescription}
                                    onChange={e => setUploadVersionDescription(e.target.value)}
                                    className="border border-gray-300 rounded p-2 mb-2 w-full"
                                    rows={3}
                                    aria-label="Version description"
                                />
                                <button
                                    onClick={onAddVersion}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    disabled={!uploadVersionFile || !uploadVersionDescription || loading}
                                >
                                    Add New Version
                                </button>
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar menu */}
                <aside className="border-l border-gray-300 pl-6">
                    <h2 className="text-xl font-semibold mb-4">Filter Models</h2>
                    <nav className="flex flex-col space-y-3">
                        {['created', 'under_scrutiny', 'rejected', 'approved'].map(statusKey => (
                            <button
                                key={statusKey}
                                onClick={() => setFilter(statusKey)}
                                className={`text-left px-4 py-2 rounded hover:bg-gray-200 focus:outline-none
                                    ${filter === statusKey ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
                                disabled={loading}
                            >
                                {statusKey === 'created' && 'Created Models'}
                                {statusKey === 'under_scrutiny' && 'Under Scrutiny'}
                                {statusKey === 'rejected' && 'Rejected'}
                                {statusKey === 'approved' && 'Approved'}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-8">
    <button
        onClick={() => setShowCreateForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
    >
        + Create Model
    </button>
</div>
                </aside>
            </div>
        </div>
    );

}

export default ProductionDashboard;
