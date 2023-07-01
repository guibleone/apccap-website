import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import documentsService from '../documents/documentsService.js'

const documents = JSON.parse(localStorage.getItem('documents'));

const initialState = {
    documents: documents ? {documents} : null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
}

// ADMIN
// pegar todos os documentos
export const getDocumentsAdmin = createAsyncThunk('documents/getAdmin', async (documents, thunkAPI) => {
    try {
        const response = await documentsService.getDocumentsAdmin(documents)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})


// pegar documentos
export const getDocuments = createAsyncThunk('documents/get', async (documents, thunkAPI) => {
    try {
        const response = await documentsService.getDocuments(documents)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// adcionar documento
export const addDocument = createAsyncThunk('documents/add', async (documents, thunkAPI) => {
    try {
        const response = await documentsService.addDocument(documents)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// baixar documentos 
export const downloadDocument = createAsyncThunk('documentos/dowload', async(documents, thunkAPI)=>{
    try {
        const response = await documentsService.downloadDocument(documents)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// deletar documento
export const deleteDocument = createAsyncThunk('documents/delete', async (documents, thunkAPI) => {
    try {
        const response = await documentsService.deleteDocument(documents)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})



export const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        resetDocuments: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = '';

        },
    },
    extraReducers: (builder) => {
        builder
        //pegar documentos
            .addCase(getDocuments.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(getDocuments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.documents = action.payload
            })
            .addCase(getDocuments.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload
            })
            //baixar documento
            .addCase(downloadDocument.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(downloadDocument.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = ('Documento baixado com sucesso')
            })
            .addCase(downloadDocument.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload
            })
            //adcionar documento
            .addCase(addDocument.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            }
            )
            .addCase(addDocument.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = ('Documento adicionado com sucesso')
                state.documents = [...state.documents, action.payload]
            }
            )
            .addCase(addDocument.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload
            }
            )
            //deletar documento
            .addCase(deleteDocument.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            }
            )
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = ('Documento deletado com sucesso')
                state.documents = state.documents.filter(document => document._id !== action.payload.id)
                
            }
            )
            .addCase(deleteDocument.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload
            }
            )
            //pegar documentos admin
            .addCase(getDocumentsAdmin.pending, (state) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            }
            )
            .addCase(getDocumentsAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.message = ''
                state.documents = action.payload
            }
            )
            .addCase(getDocumentsAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload
            }
            )

    }

})

export const { resetDocuments } = documentsSlice.actions
export default documentsSlice.reducer