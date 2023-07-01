import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import resumeReducer from '../features/resume/resumeSlice';
import documentsReducer from '../features/documents/documentsSlice'
import adminReducer from '../features/admin/adminSlice'
import productsReducer from '../features/products/productsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    documents: documentsReducer,
    admin: adminReducer,
    products: productsReducer,
  },
});
