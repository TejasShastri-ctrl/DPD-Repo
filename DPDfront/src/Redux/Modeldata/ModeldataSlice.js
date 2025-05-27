import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/modeldata';

// ───────────────────────────────────────────────
// ASYNC THUNKS

// Get all Modeldata
export const fetchAllModeldata = createAsyncThunk(
  'modeldata/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      console.log("Fetched model data - ", response.data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get a single Modeldata by ID
export const fetchModeldataById = createAsyncThunk(
  'modeldata/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get all versions of a specific Modeldata
export const fetchModeldataVersions = createAsyncThunk(
  'modeldata/fetchVersions',
  async (modeldataId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${modeldataId}/versions`);
      console.log("Fetched model data versions - ", response.data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a new Modeldata with file
export const createNewModeldata = createAsyncThunk(
  'modeldata/create',
  async ({ userId, name, type, description, file }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('name', name);
      formData.append('type', type);
      formData.append('description', description);
      formData.append('file', file);

      console.log("FormData:", { userId, name, type, description, file });

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("createNewModeldata response:", response.data);

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);


// Add a new version to existing Modeldata
export const addModeldataVersion = createAsyncThunk(
  'modeldata/addVersion',
  async ({ modeldataId, file, description, dimensions }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);
      formData.append('dimensions', dimensions); // append dimensions

      const response = await axios.post(`${API_URL}/${modeldataId}/versions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);



// Get Modeldata for a specific user
export const fetchModeldataByUserId = createAsyncThunk(
  'modeldata/fetchByUserId',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      console.log("Fetched model data - ", response.data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);



//! QA ACTIONS

export const markModeldataUnderScrutiny = createAsyncThunk(
  'modeldata/markUnderScrutiny',
  async (modeldataId, thunkAPI) => {
    try {
      await axios.put(`${API_URL}/${modeldataId}/under-scrutiny`);
      return { modeldataId, status: 'UNDER_SCRUTINY' };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markModeldataSentBack = createAsyncThunk(
  'modeldata/markSentBack',
  async (modeldataId, thunkAPI) => {
    try {
      await axios.put(`${API_URL}/${modeldataId}/sent-back`);
      return { modeldataId, status: 'SENT_BACK' };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markModeldataApproved = createAsyncThunk(
  'modeldata/markApproved',
  async (modeldataId, thunkAPI) => {
    try {
      await axios.put(`${API_URL}/${modeldataId}/approved`);
      return { modeldataId, status: 'APPROVED' };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchModeldataUnderScrutiny = createAsyncThunk(
  'modeldata/fetchUnderScrutiny',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8080/api/modeldata/under-scrutiny');
      console.log("Fetched model data under scrutiny - ", response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const rejectModeldataVersion = createAsyncThunk(
  'modeldata/rejectVersion',
  async ({ versionId, modeldataId, remarks, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("remarks", remarks);
      formData.append("modeldataId", modeldataId);

      if (file instanceof File) {
        formData.append("file", file);
      } else {
        throw new Error("Invalid file provided for rejection.");
      }

      const response = await axios.put(
        `http://localhost:8080/api/modeldata/versions/${versionId}/reject`,
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);








// ───────────────────────────────────────────────
// SLICE

const modeldataSlice = createSlice({
  name: 'modeldata',
  initialState: {
    list: [],
    selectedModel: null,
    versionHistory: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedModel: (state) => {
      state.selectedModel = null;
      state.versionHistory = [];
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
      state.versionHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
  .addCase(rejectModeldataVersion.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(rejectModeldataVersion.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;

    const updatedVersionOrModel = action.payload;
    if (updatedVersionOrModel.id) {
      if (state.selectedModel && state.selectedModel.id === updatedVersionOrModel.id) {
        state.selectedModel = updatedVersionOrModel;
      }
      if (updatedVersionOrModel.versions) {
        state.versionHistory = updatedVersionOrModel.versions;
      }
    }
  })
  .addCase(rejectModeldataVersion.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })

      // fetchAllModeldata
      .addCase(fetchAllModeldata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllModeldata.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllModeldata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchModeldataById
      .addCase(fetchModeldataById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModeldataById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedModel = action.payload;
      })
      .addCase(fetchModeldataById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchModeldataVersions
      .addCase(fetchModeldataVersions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModeldataVersions.fulfilled, (state, action) => {
        state.loading = false;
        state.versionHistory = action.payload;
      })
      .addCase(fetchModeldataVersions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createNewModeldata
      .addCase(createNewModeldata.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.error = null;
      })
      .addCase(createNewModeldata.rejected, (state, action) => {
        state.error = action.payload;
      })

      // addModeldataVersion
      .addCase(addModeldataVersion.fulfilled, (state, action) => {
        const updated = action.payload;
        state.selectedModel = updated;
        state.error = null;
      })
      .addCase(addModeldataVersion.rejected, (state, action) => {
        state.error = action.payload;
      })

      // fetchModeldataByUserId
      .addCase(fetchModeldataByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModeldataByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchModeldataByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Status change thunks
      .addCase(markModeldataUnderScrutiny.fulfilled, (state, action) => {
        const { modeldataId, status } = action.payload;
        const index = state.list.findIndex((m) => m.id === modeldataId);
        if (index !== -1) state.list[index].status = status;
        if (state.selectedModel?.id === modeldataId) state.selectedModel.status = status;
      })
      .addCase(markModeldataUnderScrutiny.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(markModeldataSentBack.fulfilled, (state, action) => {
        const { modeldataId, status } = action.payload;
        const index = state.list.findIndex((m) => m.id === modeldataId);
        if (index !== -1) state.list[index].status = status;
        if (state.selectedModel?.id === modeldataId) state.selectedModel.status = status;
      })
      .addCase(markModeldataSentBack.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(markModeldataApproved.fulfilled, (state, action) => {
        const { modeldataId, status } = action.payload;
        const index = state.list.findIndex((m) => m.id === modeldataId);
        if (index !== -1) state.list[index].status = status;
        if (state.selectedModel?.id === modeldataId) state.selectedModel.status = status;
      })
      .addCase(markModeldataApproved.rejected, (state, action) => {
        state.error = action.payload;
      })

      // fetchModeldataUnderScrutiny
      .addCase(fetchModeldataUnderScrutiny.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModeldataUnderScrutiny.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchModeldataUnderScrutiny.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedModel, setSelectedModel } = modeldataSlice.actions;
// state management sucks

export default modeldataSlice.reducer;