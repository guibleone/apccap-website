import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../auth/authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    pending: false,
    isLoading: false,
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

// reinicar aprovação

export const resetAprove = createAsyncThunk('auth/reset', async (user, thunkAPI) => {
    try {
        const response = await authService.resetAprove(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// enviar recurso

export const sendRecurso = createAsyncThunk('auth/sendRecurso', async (resource, thunkAPI) => {
    try {
        const response = await authService.sendRecurso(resource)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// associação ter acesso de produtor

export const associateProducer = createAsyncThunk('auth/associateProducer', async (user, thunkAPI) => {
    try {
        const response = await authService.associateProducer(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// submter formulário de requerimento

export const submitForm = createAsyncThunk('auth/submitForm', async(user, thunkAPI) => {
    try {
        const response = await authService.submitForm(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// associar como produtor_associado

export const associate = createAsyncThunk('auth/associate', async(user, thunkAPI) => {
    try {
        const response = await authService.associate(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// cancelar credencial

export const cancelCredencial = createAsyncThunk('auth/cancelCredencial', async(user, thunkAPI) => {
    try {
        const response = await authService.cancelCredencial(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }

})

// redefinir senha

export const resetPassword = createAsyncThunk('auth/resetPassword', async(user, thunkAPI) => {
    try {
        const response = await authService.resetPassword(user)
        return response
    }
    catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
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
            state.isLoading = false
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
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
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
            })
            // resetar aprovação
            .addCase(resetAprove.pending, (state) => {
                state.isLoading = true
            })
            .addCase(resetAprove.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = 'Aprovação reiniciada com sucesso'
                state.user = action.payload
            })
            .addCase(resetAprove.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // enviar recurso
            .addCase(sendRecurso.pending, (state) => {
                state.isLoading = true
            })
            .addCase(sendRecurso.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = 'Recurso enviado com sucesso'
                state.user = action.payload
            })
            .addCase(sendRecurso.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // associação ter acesso produtor
            .addCase(associateProducer.pending, (state) => {
                state.isLoading = true
            })
            .addCase(associateProducer.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.message = 'Troca de status realizada com sucesso'
                state.user = action.payload
            })
            .addCase(associateProducer.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // submeter formulário de requerimento
            .addCase(submitForm.pending, (state) => {
                state.isLoading = true
            })
            .addCase(submitForm.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = 'Formulário enviado com sucesso'
                state.user = action.payload
            })
            .addCase(submitForm.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // associar como produtor_associado
            .addCase(associate.pending, (state) => {
                state.isLoading = true
            })
            .addCase(associate.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = 'Associado com sucesso'
                state.user = action.payload
            })
            .addCase(associate.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // cancelar credencial
            .addCase(cancelCredencial.pending, (state) => {
                state.isLoading = true
            })
            .addCase(cancelCredencial.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = 'Credencial cancelada com sucesso'
                state.user = action.payload
            })
            .addCase(cancelCredencial.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // redefinir senha
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })



            
    }

})

export const { reset } = authSlice.actions;
export default authSlice.reducer;
