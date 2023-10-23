import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import spreadSheetService from "./spreadSheetService.js"

// initial state

const initialState = {
    spreadSheets: null,
    singleSpread: null,
    isError: false,
    isLoading: false,
    message: '',
    excel: {
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
    }
}

// pegar planilhas
export const getSpreadSheets = createAsyncThunk('spreadSheets/get', async (spreadSheets, thunkAPI) => {
    try {
        const response = await spreadSheetService.getSpreadSheets(spreadSheets)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// pegar única plnilha
export const getOneSpread = createAsyncThunk('oneSpread/get', async (spreadSheet, thunkAPI) => {
    try {
        const response = await spreadSheetService.getOneSpread(spreadSheet)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// adicionar planilha
export const addSpreadSheet = createAsyncThunk('spreadSheet/add', async (spreadSheet, thunkAPI) => {
    try {
        const response = await spreadSheetService.addSpreadSheet(spreadSheet)
        return response
    }
    catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// exclui planilha
export const deleteSpreadSheet = createAsyncThunk('spreadSheet/delete', async (spreadSheet, thunkAPI) => {
    try {
        const response = await spreadSheetService.deleteSpreadSheet(spreadSheet)
        return response
    }
    catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// adicionar planilha Excel
export const addExcel = createAsyncThunk('spreadSheet/addExcel', async (spreadSheet, thunkAPI) => {
    try {
        const response = await spreadSheetService.addExcel(spreadSheet)
        return response
    }
    catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// deletar planilha Excel
export const deleteExcel = createAsyncThunk('spreadSheet/deleteExcel', async (spreadSheet, thunkAPI) => {
    try {
        const response = await spreadSheetService.deleteExcel(spreadSheet)
        return response
    }
    catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// editar planilha
export const editSpreadSheet = createAsyncThunk('spreadSheet/edit', async (spreadSheet, thunkAPI) => {
    try {
        const response = await spreadSheetService.editSpreadSheet(spreadSheet)
        return response
    }
    catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})


// slice

const spreadSheetSlice = createSlice({
    name: 'spreadSheet',
    initialState,
    reducers: {
        reset: state => initialState,
        resetSpreadSheet(state, action) {
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ''
        },
        resetExcel(state, action) {
            state.excel.isError = false
            state.excel.isSuccess = false
            state.excel.isLoading = false
            state.excel.message = ''
        },
        setSpreadsheets: (state, action) => {
            state.spreadSheets = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // pegar planilhas 
            .addCase(getSpreadSheets.pending, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getSpreadSheets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.spreadSheets = action.payload
            })
            .addCase(getSpreadSheets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload
            })
            // pegar única planilha
            .addCase(getOneSpread.pending, (state, action) => {
                state.isLoading = true;
            }
            ).addCase(getOneSpread.fulfilled, (state, action) => {
                state.isLoading = false;
                state.singleSpread = action.payload
            }
            ).addCase(getOneSpread.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload
            })
            // adicionar planilha
            .addCase(addSpreadSheet.pending, (state, action) => {
                state.isLoading = true;
            }
            ).addCase(addSpreadSheet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.spreadSheets = [...state.spreadSheets, action.payload]
            }
            ).addCase(addSpreadSheet.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload
            })
            // exclui planilha
            .addCase(deleteSpreadSheet.pending, (state, action) => {
                state.isLoading = true;
            }
            ).addCase(deleteSpreadSheet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload
            }
            ).addCase(deleteSpreadSheet.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload
            })
            // adicionar planilha Excel
            .addCase(addExcel.pending, (state, action) => {
                state.excel.isLoading = true;
            }
            ).addCase(addExcel.fulfilled, (state, action) => {
                state.excel.isLoading = false;
                state.excel.isSuccess = true;
                state.excel.message = action.payload
            }
            ).addCase(addExcel.rejected, (state, action) => {
                state.excel.isLoading = false;
                state.excel.isError = true;
                state.excel.message = action.payload
            })
            // deletar planilha Excel
            .addCase(deleteExcel.pending, (state, action) => {
                state.excel.isLoading = true;
            }
            ).addCase(deleteExcel.fulfilled, (state, action) => {
                state.excel.isLoading = false;
                state.excel.isSuccess = true;
                state.excel.message = action.payload
            }
            ).addCase(deleteExcel.rejected, (state, action) => {
                state.excel.isLoading = false;
                state.excel.isError = true;
                state.excel.message = action.payload
            })
            // editar planilha
            .addCase(editSpreadSheet.pending, (state, action) => {
                state.isLoading = true;
            }
            ).addCase(editSpreadSheet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Planilha editada com sucesso'
                state.singleSpread = action.payload
            }
            ).addCase(editSpreadSheet.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload
            })
            // pegar planilhas sem login
    }
})

export const { resetSpreadSheet, resetExcel, reset,setSpreadsheets } = spreadSheetSlice.actions
export default spreadSheetSlice.reducer