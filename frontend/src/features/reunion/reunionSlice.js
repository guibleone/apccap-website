import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reunionService from "./reunionService";


const initialState = {
    reunionData: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
}


// listar reuniões por data

export const getReunions = createAsyncThunk('reunion/getReunions', async (reunion, thunkAPI) => {
    try {
        const response = await reunionService.getReunions(reunion);
        return response;
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);

    }
})

// criar reunião

export const createReunion = createAsyncThunk('reunion/createReunion', async (reunion, thunkAPI) => {
    try {
        const response = await reunionService.createReunion(reunion);
        thunkAPI.dispatch(getReunions(reunion.token));
        return response;
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);

    }
})

// concluir reunião

export const finishReunion = createAsyncThunk('reunion/finishReunion', async (reunion, thunkAPI) => {
    try {
        const response = await reunionService.finishReunion(reunion);
        thunkAPI.dispatch(getReunions(reunion.token));
        return response;
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);

    }
})


// adicioanr ata de reunião

export const addReunionAta = createAsyncThunk('reunion/addReunionAta', async (reunion, thunkAPI) => {
    try {
        const response = await reunionService.addReunionAta(reunion);
        thunkAPI.dispatch(getReunions(reunion.token));
        return response;
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);

    }
})

// assinar ata

export const signAta = createAsyncThunk('reunion/signAta', async (reunion, thunkAPI) => {
    try {
        const response = await reunionService.signAta(reunion);
        thunkAPI.dispatch(getReunions(reunion.token));
        return response;
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);

    }
})

// deletar reunião

export const deleteReunion = createAsyncThunk('reunion/deleteReunion', async (reunion, thunkAPI) => {
    try {
        const response = await reunionService.deleteReunion(reunion);
        thunkAPI.dispatch(getReunions(reunion.token));
        return response;
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);

    }
})


export const reunionSlice = createSlice({
    name: 'reunion',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // criar reunião
            .addCase(createReunion.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(createReunion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = 'Reunião criada com sucesso';
            })
            .addCase(createReunion.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
            // listar reuniões por data
            .addCase(getReunions.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(getReunions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
                state.reunionData = action.payload;
            })
            .addCase(getReunions.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
            // concluir reunião
            .addCase(finishReunion.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(finishReunion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = action.payload;
            })
            .addCase(finishReunion.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
            // adicionar ata da reunião
            .addCase(addReunionAta.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(addReunionAta.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = 'Ata adicionada com sucesso'
            })
            .addCase(addReunionAta.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
            // assinar ata da reunião
            .addCase(signAta.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(signAta.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = 'Ata assinada com sucesso'
            })
            .addCase(signAta.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
            // deletar reunião
            .addCase(deleteReunion.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(deleteReunion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = 'Reunião deletada com sucesso'
            })
            .addCase(deleteReunion.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
})

export const { reset } = reunionSlice.actions;

export default reunionSlice.reducer;

