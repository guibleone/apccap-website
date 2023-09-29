import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentsService from "./paymentsService.js";

const initialState = {
    payments: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
}

// pegar assinatura

export const getSubscription = createAsyncThunk('payments/getSubscription', async (user, thunkAPI) => {
    try {
        const response = await paymentsService.getSubscription(user)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// pegar balanço

export const getBalance = createAsyncThunk('payments/getBalance', async (token, thunkAPI) => {
    try {
        const response = await paymentsService.getBalance(token)
        return response
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})



const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        resetPayments: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = '';
            state.payments = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // pegar assinatura
            .addCase(getSubscription.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSubscription.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.payments = action.payload;
            })
            .addCase(getSubscription.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
        // pegar balanço
            .addCase(getBalance.pending, (state) => {
                state.isLoading = true;
            }
            )
            .addCase(getBalance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.payments = action.payload;
            }
            )
            .addCase(getBalance.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            }
            )
            
    }
})

export const { resetPayments } = paymentsSlice.actions
export default paymentsSlice.reducer