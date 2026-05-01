import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	register: {
		username: '',
		password: '',
		passwordConfirm: '',
	},
	login: {
		username: '',
		password: '',
	},
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		changeField: (state, action) => {
			const { form, key, value } = action.payload;
			state[form][key] = value;
		},
		initializeForm: (state, action) => {
			const form = action.payload;
			state[form] = initialState[form];
		},
	},
});

export const { changeField, initializeForm } = authSlice.actions;
export default authSlice.reducer;
