import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "./blogService";

const initialState = {
    publications: [],
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

})

// exportar actions
export const { setPublications, setDestaques,reset } = blogSlice.actions
export default blogSlice.reducer


