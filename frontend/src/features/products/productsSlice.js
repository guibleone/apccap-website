import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productsService from './productsService'

const product = JSON.parse(localStorage.getItem('product'))
const error = JSON.parse(localStorage.getItem('error'))

const initialState = {
    productsData: [],
    productData: product ? product : {},
    isError: false,
    isLoading: false,
    isSuccess: false,
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
export const addProduct = createAsyncThunk('products/addProduct', async (product, thunkAPI) => {
    try {
        const response = await productsService.addProduct(product)
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
export const updateProduct = createAsyncThunk('products/updateProduct', async (product, thunkAPI) => {
    try {
        const response = await productsService.updateProduct(product)
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
export const trackProduct = createAsyncThunk('products/track', async(selo, thunkAPI)=>{
    try {
        const response = await productsService.trackProduct(selo)
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
        }
    },
    extraReducers: (builder) => {
        builder
            // pegar produtos
            .addCase(getProducts.pending, state => {
                state.isLoading = true
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isSuccess = true
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
                state.isSuccess = true
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
                state.productsData = [...state.productsData, action.payload]
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // deletar produto
            .addCase(deleteProduct.pending, state => {
                state.isLoading = true
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.isLoading = false;
                state.isError = false;
                state.productsData.splice(state.productsData.indexOf(action.payload), 1)
                state.productsData = state.productsData.filter(product => product.id !== action.payload.id);
            })
            
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isSuccess = false
                state.isLoading = false
                state.isError = true
                state.message = action.payload
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
    }
})

export const { clear } = productsSlice.actions
export default productsSlice.reducer

