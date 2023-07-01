import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../auth/authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    pending: false,
    isSuccess: false,
    message: '',
}

// registrar usuario
export const registerUser = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        const response = await authService.registerUser(user);
        return response;
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);

    }
}
)

// login de usuário
export const loginUser = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        const response = await authService.loginUser(user)
        return response
    } catch (error) {
        // caso ocorra algum erro

        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
}
)

// sair da conta
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await authService.logout()
    } catch (error) {
        // caso ocorra algum erro

        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
}
)

// atualizar usuário
export const updateUser = createAsyncThunk('auth/update', async (user, thunkAPI) => {
    try {
        // pegar o token do usuário
        const token = thunkAPI.getState().auth.user.token

        return await authService.updateUser(user, token)

    } catch (error) {
        // caso ocorra algum erro

        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
}
)

// adicionar foto de perfil
export const addProfilePhoto = createAsyncThunk('auth/addPhoto', async (user, thunkAPI) => {
    try {
        // pegar o token do usuário
        const token = thunkAPI.getState().auth.user.token

        return await authService.addProfilePhoto(user, token)

    } catch (error) {
        // caso ocorra algum erro

        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})


// slice para funções de autnticação de usuário
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.pending = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            //registrar usuário
            .addCase(registerUser.pending, (state) => {
                state.pending = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.pending = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.pending = false;
                state.isError = true;
                state.message = action.payload;
            })
            // login de usuário
            .addCase(loginUser.pending, (state) => {
                state.pending = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.pending = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.pending = false;
                state.isError = true;
                state.message = action.payload;
            })
            // atualizar usuário
            .addCase(updateUser.pending, (state) => {
                state.pending = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.pending = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.pending = false;
                state.isError = true;
                state.message = action.payload;
            })
            // adicionar foto de perfil
            .addCase(addProfilePhoto.pending, (state) => {
                state.pending = true;
            })
            .addCase(addProfilePhoto.fulfilled, (state, action) => {
                state.pending = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(addProfilePhoto.rejected, (state, action) => {
                state.pending = false;
                state.isError = true;
                state.message = action.payload;
            })
            // logout de usuário
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            }
            )
    }


})

export const { reset } = authSlice.actions;
export default authSlice.reducer;
