import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	title: '',
	body: '',
	tags: [],
	originalPostId: null,
};

const writeSlice = createSlice({
	name: 'write',
	initialState,
	reducers: {
		initializeEditor: () => initialState,
		changeField: (state, action) => {
			const { key, value } = action.payload;
			state[key] = value;
		},
		setOriginalPost: (state, action) => {
			const post = action.payload;
			state.title = post.title;
			state.body = post.body;
			state.tags = post.tags;
			state.originalPostId = post._id;
		},
	},
});

export const { initializeEditor, changeField, setOriginalPost } =
	writeSlice.actions;

export default writeSlice.reducer;
