import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "./blogService";

const initialState = {
    publications: [],
    singlePublication: null,
    destaques: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ''
}

// criar uma nova notícia
export const createPublication = createAsyncThunk('blog/createPublication', async (publication, thunkAPI) => {
    try {
        const response = await blogService.createPublication(publication)
        return response
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }

})

// pegar única notícia
export const getSinglePublication = createAsyncThunk('blog/getSinglePublication', async (id, thunkAPI) => {
    try {
        const response = await blogService.getSinglePublication(id)
        return response
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }

})

// deletar uma notícia
export const deletePublication = createAsyncThunk('blog/deletePublication', async (id, thunkAPI) => {
    try {
        const response = await blogService.deletePublication(id)
        return response
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }

})

// editar uma notícia
export const editPublication = createAsyncThunk('blog/editPublication', async (publication, thunkAPI) => {
    try {
        const response = await blogService.editPublication(publication)
        return response
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }

})


// crirr o slice
export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setPublications: (state, action) => {
            state.publications = action.payload.publications
        },
        setDestaques: (state, action) => {
            state.destaques = action.payload.publications
        },
        reset: (state) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = false
            state.message = ''
        },
        resetSinglePublication: (state) => {
            state.singlePublication = null
        },
        resetPublications: (state) => {
            state.publications = []
            state.destaques = []
        }
    },
    extraReducers:
        (builder) => builder
            .addCase(createPublication.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
                state.message = ''
            })
            .addCase(createPublication.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = 'Publicação criada com sucesso.'
            })
            .addCase(createPublication.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload ? action.payload : 'Não foi possível criar uma nova publicação.'
            })
            // pegar única notícia
            .addCase(getSinglePublication.pending, (state) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = false
                state.message = ''
            })
            .addCase(getSinglePublication.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = false
                state.message = ''
                state.singlePublication = action.payload
            })
            .addCase(getSinglePublication.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload ? action.payload : 'Não foi possível encontrar a publicação.'
            })
            // deletar uma notícia
            .addCase(deletePublication.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
                state.message = ''
            })
            .addCase(deletePublication.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = 'Publicação deletada com sucesso.'
            })
            .addCase(deletePublication.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload ? action.payload : 'Não foi possível deletar a publicação.'
            })
            // editar uma notícia
            .addCase(editPublication.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
                state.message = ''
            })
            .addCase(editPublication.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = 'Publicação editada com sucesso.'
            })
            .addCase(editPublication.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload ? action.payload : 'Não foi possível editar a publicação.'
            })

})

// exportar actions
export const { setPublications, setDestaques, reset, resetSinglePublication, resetPublications } = blogSlice.actions
export default blogSlice.reducer


