import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";

const initialState = {
    users: {
        todos: [],
        credenciamento: [],
        produtos: []
    },
    membros: [],
    produtores: {
        todos: [],
        amparo: [],
        águas_de_lindóia: [],
        serra_negra: [],
        holambra: [],
        jaguariúna: [],
        lindóia: [],
        monte_alegre_do_sul: [],
        pedreira: [],
        socorro: [],
    },
    userData: {},
    resumeData: null,
    documentsData: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    emailStatus: {
        isSuccess: false,
        isError: false,
        isLoading: false,
        message: '',
    },
    message: '',
}

// pegar usuário ** APAGAR **
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
 // atualizar lista de usuários 
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
    try {
        const response = await adminService.disapproveUser(user)
 // atualizar lista de usuários
        return response
    } catch (error) {
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

// aprovar relatórios
export const approveRelatory = createAsyncThunk('admin/relatory-approve', async (user, thunkAPI) => {
    try {
        const response = await adminService.approveRelatory(user)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// reprovar relatorios

export const repproveRelatory = createAsyncThunk('admin/relatory-repprove', async (user, thunkAPI) => {
    try {
        const response = await adminService.repproveRelatory(user)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// PARTE DO PRESIDENTE

export const getProducts = createAsyncThunk('presidente/products', async (user, thunkAPI) => {
    try {
        const response = await adminService.getProducts(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// aprovar selos

export const approveSelos = createAsyncThunk('presidente/approveSelos', async (user, thunkAPI) => {

    try {
        const response = await adminService.approveSelos(user)

        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// desaprovar selos

export const disaproveSelos = createAsyncThunk('presidente/disaproveSelos', async (user, thunkAPI) => {

    try {
        const response = await adminService.disaproveSelos(user)

        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// PARTE DO CONSELHO

export const addRelatorys = createAsyncThunk('conselho/addRelatorys', async (user, thunkAPI) => {

    try {
        const response = await adminService.addRelatorys(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteRelatorys = createAsyncThunk('conselho/deleteRelatorys', async (user, thunkAPI) => {

    try {
        const response = await adminService.deleteRelatorys(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// aprovar recurso
export const approveRecurso = createAsyncThunk('conselho/approveRecurso', async (user, thunkAPI) => {
    try {
        const response = await adminService.approveRecurso(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//reporvar recurso
export const repproveRecurso = createAsyncThunk('conselho/repproveRecurso', async (user, thunkAPI) => {
    try {
        const response = await adminService.repproveRecurso(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// QUEM SOMOS

export const getMembros = createAsyncThunk('quem-somos/membros', async (_, thunkAPI) => {
    try {
        const response = await adminService.getMembros()
        return response
    } catch (error) {
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

export const sendRelatoryEmail = createAsyncThunk('admin/relatoryEmail', async (user, thunkAPI) => {
    try {
        const response = await adminService.sendRelatoryEmail(user)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const sendRecursoEmail = createAsyncThunk('admin/recursoEmail', async (user, thunkAPI) => {
    try {
        const response = await adminService.sendRecursoEmail(user)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const sendProductRelatoryEmail = createAsyncThunk('admin/produtoEmail', async (user, thunkAPI) => {
    try {
        const response = await adminService.sendProductRelatoryEmail(user)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


export const sendResetEmail = createAsyncThunk('admin/resetEmail', async (user, thunkAPI) => {
    try {
        const response = await adminService.sendResetEmail(user)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        reset: state => initialState,
        resetStatus: state => {
            state.message = ''
            state.isSuccess = false
            state.isError = false
            state.isLoading = false
        },
        resetEmailStatus: state => {
            state.emailStatus = initialState.emailStatus
            state.isSuccess = false
        },
        setProdutores: (state, action) => {
            state.produtores = { ...state.produtores, [action.payload.formatedCidade]: action.payload.produtores }
        },
        setUsers: (state, action) => {
            if (action.payload.productsQuantity === 'true') {
                state.users.produtos = action.payload.users
            }
            if (action.payload.productsQuantity === 'false') {
                state.users.credenciamento = action.payload.users
            }
            if(action.payload.roles){
                state.users.todos = action.payload.users
            }

            state.users = { ...state.users }
        }
    },
    extraReducers: (builder) => {
        builder
            // pegar usuário
            .addCase(getUserData.pending, state => {
                state.isLoading = true
            })
            .addCase(getUserData.fulfilled, (state, action) => {
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
                state.isLoading = false
                state.isError = false
                state.documentsData = action.payload
            }
            )
            .addCase(getDocumentsData.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            })
            // deletar usuário
            .addCase(deleteUser.pending, state => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.message = action.payload
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            })
            // alterar nível de acesso do usuário
            .addCase(alterAccess.pending, state => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(alterAccess.fulfilled, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = false
                state.userData = action.payload
            })
            .addCase(alterAccess.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            })
            // aprovar usuário      
            .addCase(aproveUser.pending, state => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(aproveUser.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.userData = action.payload
                state.message = 'Usuário aprovado com sucesso!'
            })
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
            })
            .addCase(sendRelatory.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.userData = action.payload
            })
            .addCase(sendRelatory.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            })
            // enviar email
            .addCase(sendEmail.pending, state => {
                state.emailStatus.isLoading = true
                state.emailStatus.isSuccess = false
                state.emailStatus.isError = false
                state.emailStatus.message = ''
            })
            .addCase(sendEmail.fulfilled, (state, action) => {
                state.emailStatus.isSuccess = true
                state.emailStatus.isLoading = false
                state.emailStatus.isError = false
                state.emailStatus.message = 'Email enviado com sucesso!'
            })
            .addCase(sendEmail.rejected, (state, action) => {
                state.emailStatus.isError = true
                state.emailStatus.isLoading = false
                state.emailStatus.message = 'Erro ao enviar email!'
            })
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
            // pegar produtos
            .addCase(getProducts.pending, state => {
                state.isLoading = true
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.productsData = action.payload
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            })
            // aprovar selos
            .addCase(approveSelos.pending, state => {
                state.isLoading = true
            })
            .addCase(approveSelos.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.userData = action.payload
                state.message = 'Selos aprovados com sucesso!'
            })
            .addCase(approveSelos.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
                state.isLoading = false
            })
            // desaprovar selos
            .addCase(disaproveSelos.pending, state => {
                state.isLoading = true
            })
            .addCase(disaproveSelos.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.userData = action.payload
                state.message = 'Selos desaprovados com sucesso!'
            })
            .addCase(disaproveSelos.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
                state.isLoading = false
            })
            // PARTE DO CONSELHO
            // adicionar relatórios
            .addCase(addRelatorys.pending, state => {
                state.isLoading = true
            })
            .addCase(addRelatorys.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.userData = action.payload
                state.message = 'Relatório adicionado com sucesso!'
            })
            .addCase(addRelatorys.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
                state.isLoading = false
            })
            // deletar relatórios
            .addCase(deleteRelatorys.pending, state => {
                state.isLoading = true
            })
            .addCase(deleteRelatorys.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.userData = action.payload
                state.message = 'Relatório deletado com sucesso!'
            })
            .addCase(deleteRelatorys.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
                state.isLoading = false
            })
            // aprovar relatórios
            .addCase(approveRelatory.pending, state => {
                state.isLoading = true
            })
            .addCase(approveRelatory.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.userData = action.payload
                state.message = 'Relatório aprovado com sucesso!'
            })
            .addCase(approveRelatory.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
                state.isLoading = false
            })
            // reprovar relatórios
            .addCase(repproveRelatory.pending, state => {
                state.isLoading = true
            })
            .addCase(repproveRelatory.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.userData = action.payload
                state.message = 'Relatório reprovado com sucesso!'
            })
            .addCase(repproveRelatory.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
                state.isLoading = false
            })
            // aprovar recurso
            .addCase(approveRecurso.pending, state => {
                state.isLoading = true
            })
            .addCase(approveRecurso.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.userData = action.payload
                state.message = 'Recurso aprovado com sucesso!'
            })
            .addCase(approveRecurso.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
                state.isLoading = false
            })
            // reprovar recurso
            .addCase(repproveRecurso.pending, state => {
                state.isLoading = true
            })
            .addCase(repproveRecurso.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.userData = action.payload
                state.message = 'Recurso reprovado com sucesso!'
            })
            .addCase(repproveRecurso.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
                state.isLoading = false
            })
            // enviar email de relatório
            .addCase(sendRelatoryEmail.pending, state => {
                state.emailStatus.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(sendRelatoryEmail.fulfilled, (state, action) => {
                state.emailStatus.isSuccess = true
                state.emailStatus.isLoading = false
                state.emailStatus.isError = false
                state.emailStatus.message = 'Email enviado com sucesso!'
            })
            .addCase(sendRelatoryEmail.rejected, (state, action) => {
                state.emailStatus.isError = true
                state.emailStatus.isLoading = false
                state.emailStatus.message = 'Erro ao enviar email!'
            })
            // enviar email de recurso
            .addCase(sendRecursoEmail.pending, state => {
                state.emailStatus.isLoading = true
                state.isSuccess = false
                state.isError = false
                state.emailStatus.isError = false
                state.emailStatus.isSuccess = false
                state.emailStatus.message = ''
            })
            .addCase(sendRecursoEmail.fulfilled, (state, action) => {
                state.emailStatus.isSuccess = true
                state.emailStatus.isLoading = false
                state.emailStatus.isError = false
                state.emailStatus.message = 'Email enviado com sucesso!'
            })
            .addCase(sendRecursoEmail.rejected, (state, action) => {
                state.emailStatus.isError = true
                state.emailStatus.isLoading = false
                state.emailStatus.message = 'Erro ao enviar email!'
            })
            // enviar email de relatório do produto
            .addCase(sendProductRelatoryEmail.pending, state => {
                state.emailStatus.isLoading = true
                state.isSuccess = false
                state.isError = false
                state.emailStatus.isError = false
                state.emailStatus.isSuccess = false
                state.emailStatus.message = ''
            })
            .addCase(sendProductRelatoryEmail.fulfilled, (state, action) => {
                state.emailStatus.isSuccess = true
                state.emailStatus.isLoading = false
                state.emailStatus.isError = false
                state.emailStatus.message = 'Email enviado com sucesso!'
            })
            .addCase(sendProductRelatoryEmail.rejected, (state, action) => {
                state.emailStatus.isError = true
                state.emailStatus.isLoading = false
                state.emailStatus.message = 'Erro ao enviar email!'
            })
            // QUEM SOMOS
            // pegar membros
            .addCase(getMembros.pending, state => {
                state.isLoading = true
            })
            .addCase(getMembros.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.membros = action.payload
            })
            .addCase(getMembros.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            })
            // enviar email de reset
            .addCase(sendResetEmail.pending, state => {
                state.emailStatus.isLoading = true
                state.isSuccess = false
                state.isError = false
                state.emailStatus.isError = false
                state.emailStatus.isSuccess = false
                state.emailStatus.message = ''
            })
            .addCase(sendResetEmail.fulfilled, (state, action) => {
                state.emailStatus.isSuccess = true
                state.emailStatus.isLoading = false
                state.emailStatus.isError = false
                state.emailStatus.message = 'Código enviado ao seu email!'
            })
            .addCase(sendResetEmail.rejected, (state, action) => {
                state.emailStatus.isError = true
                state.emailStatus.isLoading = false
                state.emailStatus.message = action.payload
            })
    }
})


export const { reset, resetEmailStatus, resetStatus, setProdutores, setUsers } = adminSlice.actions
export default adminSlice.reducer