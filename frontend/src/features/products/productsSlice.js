import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productsService from './productsService'

const product = JSON.parse(localStorage.getItem('product'))
const error = JSON.parse(localStorage.getItem('error'))

const initialState = {
    productsData: [],
    productData: product ? product : {},
    producer: {},
    producerResume: {},
    selos: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    isSuccessSelos: false,
    message: error ? error : '',
}


// pegar produtos
export const getProducts = createAsyncThunk('products/getProducts', async (user, thunkAPI) => {
    try {
        const response = await productsService.getProducts(user)
        return response
    } catch (error) {
        // caso ocorra algum erro

        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
}
)

// adicionar produtos
export const addProduct = createAsyncThunk('products/addProduct', async ({ productData, userData }, thunkAPI) => {
    try {
        const response = await productsService.addProduct(productData)
        thunkAPI.dispatch(getProducts(userData)) // salva vidas // dispatch para atualizar a lista de produtos
        thunkAPI.dispatch(getSelos(userData)) // salva vidas // dispatch para atualizar a lista de produtos
        return response
    } catch (error) {
        // caso ocorra algum erro             
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
}
)

// deletar produtos
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (product, thunkAPI) => {
    try {
        const response = await productsService.deleteProduct(product)
        thunkAPI.dispatch(getProducts()) // salva vidas // dispatch para atualizar a lista de produtos
        return response
    } catch (error) {
        // caso ocorra algum erro              
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
}
)

// pegar único produto
export const getSingleProduct = createAsyncThunk('products/singleProduct', async (product, thunkAPI) => {
    try {
        const response = await productsService.getSingleProduct(product)
        return response
    } catch (error) {
        // caso ocorra algum erro              
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// atualizar produto
export const updateProduct = createAsyncThunk('products/updateProduct', async ({ inputData, userData }, thunkAPI) => {
    try {
        const response = await productsService.updateProduct(inputData)
        thunkAPI.dispatch(getSelos(userData)) // salva vidas // dispatch para atualizar a lista de produtos
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// adicionar foto do produto
export const addProductPhoto = createAsyncThunk('products/addProductPhoto', async (product, thunkAPI) => {
    try {
        const response = await productsService.addProductPhoto(product)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// rastrear produto
export const trackProduct = createAsyncThunk('products/track', async (selo, thunkAPI) => {
    try {
        const response = await productsService.trackProduct(selo)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// pegar produtor
export const getProducer = createAsyncThunk('products/getProducer', async (producer, thunkAPI) => {
    try {
        const response = await productsService.getProducer(producer)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// pegar resumo do produtor
export const getProducerResume = createAsyncThunk('products/getProducerResume', async (producer, thunkAPI) => {
    try {
        const response = await productsService.getProducerResume(producer)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// pegar selos 
export const getSelos = createAsyncThunk('products/getSelos', async (user, thunkAPI) => {
    try {

        const response = await productsService.getSelos(user)
        return response

    } catch (error) {
        // caso ocorra algum erro

        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// adcionar selo
export const addSelo = createAsyncThunk('products/addSelo', async (user, thunkAPI) => {
    try {
        const response = await productsService.addSelo(user)
        thunkAPI.dispatch(getSelos(user)) // salva vidas // dispatch para atualizar a lista de produtos
        return response
    } catch (error) {
        // caso ocorra algum erro

        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// adcionar selo pago

export const addSelosPayed = createAsyncThunk('products/addSelosPayed', async (user, thunkAPI) => {

    try {
        const response = await productsService.addSelosPayed(user)
        thunkAPI.dispatch(getProducts(user)) // salva vidas // dispatch para atualizar a lista de produtos
        return response
    } catch (error) {
        // caso ocorra algum erro

        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }

})

// adicionar relatórios de produtos

export const addRelatorysProducts = createAsyncThunk('products/addRelatorysProducts', async (user, thunkAPI) => {

    try {
        const response = await productsService.addRelatorysProducts(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// deletar relatórios de produtos

export const deleteRelatorysProducts = createAsyncThunk('products/deleteRelatorysProducts', async (user, thunkAPI) => {
    try {
        const response = await productsService.deleteRelatorysProducts(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// aprovar relatórios de produtos

export const approveProductRelatory = createAsyncThunk('products/approveProductRelatory', async (user, thunkAPI) => {
    try {
        const response = await productsService.approveProductRelatory(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// repprove relatórios de produtos

export const repproveProductRelatory = createAsyncThunk('products/repproveProductRelatory', async (user, thunkAPI) => {
    try {
        const response = await productsService.repproveProductRelatory(user)
        return response
    } catch (error) {
        // caso ocorra algum erro
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})


const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clear(state) {
            state.message = ''
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
        },
        reset(state) {
            state.message = ''
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.productData = {}
        }

    },
    extraReducers: (builder) => {
        builder
            // pegar produtos
            .addCase(getProducts.pending, state => {
                state.isLoading = true
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.pending = false
                state.isLoading = false
                state.isError = false
                state.productsData = action.payload
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // pegar único produtos
            .addCase(getSingleProduct.pending, state => {
                state.isLoading = true
            })
            .addCase(getSingleProduct.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.productData = action.payload
            })
            .addCase(getSingleProduct.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            // adicionar produto
            .addCase(addProduct.pending, state => {
                state.isLoading = true
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.message = 'Produto adicionado com sucesso'
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.isSuccessSelos = false
                state.message = action.payload
            })
            // deletar produto
            .addCase(deleteProduct.pending, state => {
                state.isLoading = true
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.isLoading = false;
                state.isError = false;
                state.message = action.payload;
            })
            // atualizar produto
            .addCase(updateProduct.pending, state => {
                state.isLoading = true
            }
            )
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.productData = action.payload
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            }
            )
            // adicionar foto do produto
            .addCase(addProductPhoto.pending, state => {
                state.isLoading = true
            }
            )
            .addCase(addProductPhoto.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.productData = action.payload
            }
            )
            .addCase(addProductPhoto.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            }
            )
            // rastrear produto
            .addCase(trackProduct.pending, state => {
                state.isLoading = true
            }
            )
            .addCase(trackProduct.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.productData = action.payload
            }
            )
            .addCase(trackProduct.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                localStorage.removeItem('product')
                localStorage.setItem('error', JSON.stringify(action.payload))
            }
            )
            // pegar produtor
            .addCase(getProducer.pending, state => {
                state.isLoading = true
            })
            .addCase(getProducer.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.producer = action.payload
            })
            .addCase(getProducer.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.isSuccessSelos = false
                state.message = action.payload
            })
            //pegar resumo do produtor
            .addCase(getProducerResume.pending, state => {
                state.isLoading = true
            }
            )
            .addCase(getProducerResume.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.producerResume = action.payload
            }
            )
            .addCase(getProducerResume.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            }
            )
            // pegar selos
            .addCase(getSelos.pending, (state) => {
                state.pending = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getSelos.fulfilled, (state, action) => {
                state.isSuccess = false;
                state.pending = false;
                state.selos = action.payload;
            })
            .addCase(getSelos.rejected, (state, action) => {
                state.pending = false;
                state.isError = true;
                state.message = action.payload;
            })
            //adicionar selo
            .addCase(addSelo.pending, (state) => {
                state.pending = true;
            }
            )
            .addCase(addSelo.fulfilled, (state, action) => {
                state.pending = false;
                state.isSuccessSelos = true;
                state.message = action.payload;
            }
            )
            .addCase(addSelo.rejected, (state, action) => {
                state.pending = false;
                state.isSuccessSelos = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            }
            )
            // adicionar selos pagos
            .addCase(addSelosPayed.pending, (state) => {
                state.pending = true;
            }
            )
            .addCase(addSelosPayed.fulfilled, (state, action) => {
                state.pending = false;
                state.isSuccessSelos = true;
                state.message = action.payload;
            }
            )
            .addCase(addSelosPayed.rejected, (state, action) => {
                state.pending = false;
                state.isSuccessSelos = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
            // adicionar relatórios de produtos
            .addCase(addRelatorysProducts.pending, state => {
                state.isLoading = true
            })
            .addCase(addRelatorysProducts.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.productData = action.payload
            })
            .addCase(addRelatorysProducts.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // deletar relatórios de produtos
            .addCase(deleteRelatorysProducts.pending, state => {
                state.isLoading = true
            })
            .addCase(deleteRelatorysProducts.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.productData = action.payload
            })
            .addCase(deleteRelatorysProducts.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // aprovar relatórios de produtos
            .addCase(approveProductRelatory.pending, state => {
                state.isLoading = true
            })
            .addCase(approveProductRelatory.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.productData = action.payload
            })
            .addCase(approveProductRelatory.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // reprovar relatórios de produtos
            .addCase(repproveProductRelatory.pending, state => {
                state.isLoading = true
            })
            .addCase(repproveProductRelatory.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                state.productData = action.payload
            })
            .addCase(repproveProductRelatory.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { clear, reset } = productsSlice.actions
export default productsSlice.reducer

