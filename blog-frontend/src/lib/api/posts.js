import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postsApi = createApi({
	reducerPath: 'postsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '/api/posts',
	}),
	tagTypes: ['Posts'],
	endpoints: (builder) => ({
		writePost: builder.mutation({
			query: ({ title, body, tags }) => ({
				url: '/',
				method: 'POST',
				body: { title, body, tags },
			}),
			invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
		}),

		updatePost: builder.mutation({
			query: ({ id, title, body, tags }) => ({
				url: `/${id}`,
				method: 'PATCH',
				body: { title, body, tags },
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Posts', id },
				{ type: 'Posts', id: 'LIST' },
			],
		}),

		readPost: builder.query({
			query: (id) => `/${id}`,
			providesTags: (result, error, id) => [{ type: 'Posts', id }],
		}),

		listPosts: builder.query({
			query: ({ page, username, tag }) => {
				const params = new URLSearchParams();
				if (page) params.append('page', page);
				if (username) params.append('username', username);
				if (tag) params.append('tag', tag);
				return `?${params.toString()}`;
			},
			transformResponse: (response) => {
				return {
					posts: response.posts,
					message: response.message,
					lastPage: parseInt(response.lastPage, 10),
				};
			},
			providesTags: [{ type: 'Posts', id: 'LIST' }],
		}),

		removePost: builder.mutation({
			query: (id) => ({
				url: `/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'Posts', id },
				{ type: 'Posts', id: 'LIST' },
			],
		}),
	}),
});

export const {
	useWritePostMutation,
	useUpdatePostMutation,
	useReadPostQuery,
	useListPostsQuery,
	useRemovePostMutation,
} = postsApi;
