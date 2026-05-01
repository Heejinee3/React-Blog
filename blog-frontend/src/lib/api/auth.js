import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser, clearUser } from '../../modules/user';

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '/api/auth',
	}),
	endpoints: (builder) => ({
		register: builder.mutation({
			query: ({ username, password }) => ({
				url: '/register',
				method: 'POST',
				body: { username, password },
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data.user));
				} catch (e) {
					dispatch(clearUser());
				}
			},
		}),
		login: builder.mutation({
			query: ({ username, password }) => ({
				url: '/login',
				method: 'POST',
				body: { username, password },
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data.user));
				} catch (e) {
					dispatch(clearUser());
				}
			},
		}),
		check: builder.query({
			query: () => '/check',
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data.user));
				} catch (e) {
					dispatch(clearUser());
				}
			},
		}),
		logout: builder.mutation({
			query: () => ({
				url: '/logout',
				method: 'POST',
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
				} finally {
					dispatch(clearUser());
				}
			},
		}),
	}),
});

export const {
	useRegisterMutation,
	useLoginMutation,
	useLogoutMutation,
	useCheckQuery,
} = authApi;
