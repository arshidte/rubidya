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

// Get the count of users
export const getUsersCount = createAsyncThunk('getUsersCount', async () => {
    const token: any = localStorage.getItem('userInfo');
    const parsedData = JSON.parse(token);

    const config = {
        headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'content-type': 'application/json',
        },
    };

    const response = await axios.get(`${URL}/api/admin/get-users-count`, config);

    return response.data;
});

export const getUsersCountSlice = createSlice({
    name: 'getUsersCountSlice',
    initialState: {
        loading: false,
        data: null,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsersCount.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(getUsersCount.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getUsersCount.rejected, (state, action) => {
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

// Register user by refferal
export const registerUserByReferral = createAsyncThunk('registerUserByRefferal', async (data: any) => {
    const config = {
        headers: {
            'content-type': 'application/json',
        },
    };

    const response = await axios.post(
        `${URL}/api/users/add-user-by-refferal`,
        { userId: data.userId, firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.mobile, password: data.password, countryCode: data.countryCode },
        config
    );

    return response.data;
});

export const registerUserByReferralSlice = createSlice({
    name: 'registerUserByReferralSlice',
    initialState: {
        loading: false,
        data: null,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUserByReferral.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(registerUserByReferral.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(registerUserByReferral.rejected, (state, action) => {
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

// Enter OTP
export const verifyOTP = createAsyncThunk('verifyOTP', async (data: any) => {

    const config = {
        headers: {
            'content-type': 'application/json',
        },
    };

    const response = await axios.post(`${URL}/api/users/verify-otp`, { userId: data.userId, OTP: data.otp }, config);

    return response.data;
});

export const verifyOTPSlice = createSlice({
    name: 'verifyOTPSlice',
    initialState: {
        loading: false,
        data: null,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(verifyOTP.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
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

// Resend OTP
export const resendOTP = createAsyncThunk('resendOTP', async (data: any) => {
    const config = {
        headers: {
            'content-type': 'application/json',
        },
    };

    const response = await axios.post(`${URL}/api/users/resend-otp`, { userId: data.userId, email: data.email }, config);

    return response.data;
});

export const resendOTPSlice = createSlice({
    name: 'resendOTPSlice',
    initialState: {
        loading: false,
        data: null,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(resendOTP.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(resendOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(resendOTP.rejected, (state, action) => {
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

export const resendOTPReducer = resendOTPSlice.reducer;
export const verifyOTPReducer = verifyOTPSlice.reducer;
export const registerUserByReferralReducer = registerUserByReferralSlice.reducer;
export const getUsersCountReducer = getUsersCountSlice.reducer;
export const getAllUsersReducer = getAllUsersSlice.reducer;
