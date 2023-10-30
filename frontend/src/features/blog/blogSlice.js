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
    },
})

// exportar actions
export const { setPublications, setDestaques } = blogSlice.actions
export default blogSlice.reducer


