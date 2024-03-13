import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../Constants';

// Get all packages to admin
export const getPackages = createAsyncThunk('getPackages', async () => {
    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.get(`${URL}/api/users/get-packages`, config);

    return response.data;
});

export const getPackagesSlice = createSlice({
    name: 'getPackagesSlice',
    initialState: {
        loading: false,
        data: null,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPackages.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(getPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getPackages.rejected, (state, action) => {
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

// Add new package
export const addPackage = createAsyncThunk('addPackage', async (data: any) => {

    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const { packageName, amount, memberProfit } = data;

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.post(`${URL}/api/admin/add-package`, { packageName, amount, memberProfit }, config);

    return response.data;
});

export const addPackageSlice = createSlice({
    name: 'addPackageSlice',
    initialState: {
        loading: false,
        data: null,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addPackage.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(addPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(addPackage.rejected, (state, action) => {
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

export const addPackageReducer = addPackageSlice.reducer;
export const getPackagesReducer = getPackagesSlice.reducer;
