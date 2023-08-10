import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";

const initialState = {
    users:[],
    userData: {},
    resumeData: null,
    documentsData: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    emailStatus:{
        isSuccess: false,
        isError: false,
        isLoading: false,
        message: '',
    },
    message: '',
}

// pegar usuário
export const getUserData = createAsyncThunk('admin/user', async (user, thunkAPI) => {
    try {
        const response = await adminService.getUserData(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// deletar usuário
export const deleteUser = createAsyncThunk('admin/delete', async (user, thunkAPI) => {
    try {
        const response = await adminService.deleteUser(user)
        thunkAPI.dispatch(listUsers(user.token)) // atualizar lista de usuários 
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})


// pegar resumo do usuário
export const getResumeData = createAsyncThunk('admin/resume', async (user, thunkAPI) => {
    try {
        const response = await adminService.getResumeData(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// pegar documentos do usuário
export const getDocumentsData = createAsyncThunk('admin/documents', async (user, thunkAPI) => {
    try {
        const response = await adminService.getDocumentsData(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// alterar nível de acesso do usuário
export const alterAccess = createAsyncThunk('admin/role', async (user, thunkAPI) => {
    try {
        const response = await adminService.alterAccess(user)
        return response 
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// listar usuários
export const listUsers = createAsyncThunk('admin/list', async (user, thunkAPI) => {
    try {
        const response = await adminService.listUsers(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// aprovar usuário
export const aproveUser = createAsyncThunk('admin/aprove', async (user, thunkAPI) => {
    try {
        const response = await adminService.aproveUser(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// desaprovar usuário

export const disapproveUser = createAsyncThunk('admin/disapprove', async (user, thunkAPI) => {
    try{
        const response = await adminService.disapproveUser(user)
        return response
    }catch(error){
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// PARTE DO SECRETÁRIO

export const sendRelatory = createAsyncThunk('admin/relatory', async (user, thunkAPI) => {
    try {
        const response = await adminService.sendRelatory(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})


// EMAIL
export const sendEmail = createAsyncThunk('admin/email', async (user, thunkAPI) => {
    try {
        const response = await adminService.sendEmail(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

export const sendConvocationEmail = createAsyncThunk('admin/convocationEmail', async (user, thunkAPI) => {
    try {
        const response = await adminService.sendConvocationEmail(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        reset: state => initialState,
        resetEmailStatus: state => {
            state.emailStatus = initialState.emailStatus
        }
    },
    extraReducers: (builder) => {
        builder
            // pegar usuário
            .addCase(getUserData.pending, state => {
                state.isLoading = true
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.userData = action.payload
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            })
            // pegar resumo do usuário
            .addCase(getResumeData.pending, state => {
                state.isLoading = true
            }
            )
            .addCase(getResumeData.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.resumeData = action.payload.splice(0, 1)[0]
            }
            )
            .addCase(getResumeData.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            }
            )
            // pegar documentos do usuário
            .addCase(getDocumentsData.pending, state => {
                state.isLoading = true
            }
            )
            .addCase(getDocumentsData.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.documentsData = action.payload        
            }
            )
            .addCase(getDocumentsData.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            }
            )
            // deletar usuário
            .addCase(deleteUser.pending, state => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            }
            )
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.users.splice(state.users.indexOf(action.payload), 1)
                state.users = state.users.filter(user => user._id !== action.payload.id);
            }
            )
            .addCase(deleteUser.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            }
            )
            // alterar nível de acesso do usuário
            .addCase(alterAccess.pending, state => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            }
            )
            .addCase(alterAccess.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.userData = action.payload
            }
            )
            .addCase(alterAccess.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            }
            ) 
            // listar usuários
            .addCase(listUsers.pending, state => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            }
            )
            .addCase(listUsers.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.users = action.payload
            }
            )
            .addCase(listUsers.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            }
            )
            // aprovar usuário      
            .addCase(aproveUser.pending, state => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            }
            )
            .addCase(aproveUser.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.userData = action.payload
                state.message = 'Usuário aprovado com sucesso!'
            }
            )
            .addCase(aproveUser.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            })
            // desaprovar usuário
            .addCase(disapproveUser.pending, state => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(disapproveUser.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.userData = action.payload
                state.message = 'Usuário desaprovado com sucesso!'
            })
            .addCase(disapproveUser.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            })
            // enviar relatório
            .addCase(sendRelatory.pending, state => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = false
            }
            )
            .addCase(sendRelatory.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.userData = action.payload
            }
            )
            .addCase(sendRelatory.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            }
            )
            // enviar email
            .addCase(sendEmail.pending, state => {
                state.emailStatus.isLoading = true
                state.emailStatus.isSuccess = false
                state.emailStatus.isError = false
                state.emailStatus.message = ''
            }
            )
            .addCase(sendEmail.fulfilled, (state, action) => {
                state.emailStatus.isSuccess = true
                state.emailStatus.isLoading = false
                state.emailStatus.isError = false
                state.emailStatus.message = 'Email enviado com sucesso!'
            }
            )
            .addCase(sendEmail.rejected, (state, action) => {
                state.emailStatus.isError = true
                state.emailStatus.isLoading = false
                state.emailStatus.message = 'Erro ao enviar email!'
            }
            )
            // convocar reunião
            .addCase(sendConvocationEmail.pending, state => {
                state.emailStatus.isLoading = true
                state.emailStatus.isSuccess = false
                state.emailStatus.isError = false
                state.emailStatus.message = ''
            })
            .addCase(sendConvocationEmail.fulfilled, (state, action) => {
                state.emailStatus.isSuccess = true
                state.emailStatus.isLoading = false
                state.emailStatus.isError = false
                state.emailStatus.message = 'Email enviado com sucesso!'
            })
            .addCase(sendConvocationEmail.rejected, (state, action) => {
                state.emailStatus.isError = true
                state.emailStatus.isLoading = false
                state.emailStatus.message = 'Erro ao enviar email!'
            })
    }
})


export const { reset, resetEmailStatus } = adminSlice.actions
export default adminSlice.reducer