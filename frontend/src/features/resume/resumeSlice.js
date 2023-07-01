import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resumeService from './resumeService';

const resume = JSON.parse(localStorage.getItem('resume'));

const initialState = {
    resume: resume ? resume : null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
}

// criar currículo
export const createResume = createAsyncThunk('resume/create', async (resume, thunkAPI) => {
    try {
        const response = await resumeService.createResume(resume);
        return response;
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);

    }
}
)

// pegar currículo
export const getResume = createAsyncThunk('resume/get', async (resume, thunkAPI) => {
    try {
        const response = await resumeService.getResume(resume);
        return response;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// atualizar currículo

export const updateResume = createAsyncThunk('resume/update', async (resume, thunkAPI) => {
    try {
        
        const response = await resumeService.updateResume(resume);  
        return response;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})



export const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        resetResume: (state) => {
            state.resume = null;
        }

    },
    extraReducers: (builder) => {
        builder
            // criar currículo
            .addCase(createResume.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(createResume.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.resume = action.payload
            })
            .addCase(createResume.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
            // pegar currículo
            .addCase(getResume.pending, (state) => {
                state.isLoading = true;
                state.resume = null
            })
            .addCase(getResume.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.resume = action.payload
            })
            .addCase(getResume.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
            // atualizar currículo
            .addCase(updateResume.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            }
            )
            .addCase(updateResume.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.resume = action.payload
            }
            )
            .addCase(updateResume.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            }
            )


    }
})

export const { reset, resetResume } = resumeSlice.actions;
export default resumeSlice.reducer;

