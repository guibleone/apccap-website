import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import relatorysService from "./relatorysService";

const initialState = {
    relatorys: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
}

// adicionar relatório

export const addRelatory = createAsyncThunk('relatorys/addRelatory', async (data) => {
    const response = await relatorysService.addRelatory(data);
    return response.data;
})

// deletar relatório

export const deleteRelatory = createAsyncThunk('relatorys/deleteRelatory', async (data) => {
    const response = await relatorysService.deleteRelatory(data);
    return response.data;
})

export const relatorysSlice = createSlice({
    name: 'relatorys',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setRelatorys: (state, action) => {
            state.relatorys = action.payload;
        },
        searchRelatorys: (state, action) => {
            state.relatorys = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        // acicionar relatório
        .addCase(addRelatory.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        })
        .addCase(addRelatory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = 'Relatório adicionado com sucesso'
        })
        .addCase(addRelatory.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = 'Erro ao adicionar relatório';
        })
        // deletar relatório
        .addCase(deleteRelatory.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        })
        .addCase(deleteRelatory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = 'Relatório deletado com sucesso'
        })
        .addCase(deleteRelatory.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = 'Erro ao adicionar relatório';
        })
    }

})

export const { reset, setRelatorys } = relatorysSlice.actions;
export default relatorysSlice.reducer;