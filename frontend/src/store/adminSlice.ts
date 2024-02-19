import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../Constants';

// Get all users to admin
export const getAllUsersToAdmin = createAsyncThunk('getAllUsers', async () => {

    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.get(`${URL}/api/admin/get-all-users`, config);

    return response.data;
});

export const getAllUsersSlice = createSlice({
    name: 'getAllUsersSlice',
    initialState: {
        loading: false,
        data: null,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsersToAdmin.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(getAllUsersToAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getAllUsersToAdmin.rejected, (state, action) => {
                state.loading = false;
                console.error('Error', action.payload);

                if (action.error.message === 'Request failed with status code 500') {
                    state.error = 'Please make sure you filled all the above details!';
                } else if (action.error.message === 'Request failed with status code 400') {
                    state.error = 'Email or Phone already used!';
                }
            });
    },
});

export const getAllUsersReducer = getAllUsersSlice.reducer;