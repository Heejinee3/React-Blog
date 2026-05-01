import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import userReducer from './user';
import { authApi } from '../lib/api/auth';
import writeReducer from './write';
import { postsApi } from '../lib/api/posts';

const store = configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
		write: writeReducer,
		[authApi.reducerPath]: authApi.reducer,
		[postsApi.reducerPath]: postsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authApi.middleware, postsApi.middleware),
});

export default store;
