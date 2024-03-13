import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import { TypedUseSelectorHook, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import authReducer from './authSlice';
import { getAllUsersReducer, getUsersCountReducer, registerUserByReferralReducer, verifyOTPReducer, resendOTPReducer } from './adminSlice';
import { addPercentagesReducer, getPercentagesReducer, editPercentagesReducer } from './levelSlice';
import { getPackagesReducer, addPackageReducer } from './packageSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    authReducer,
    getAllUsers: getAllUsersReducer,
    addPercentages: addPercentagesReducer,
    getUsersCount: getUsersCountReducer,
    registerByReferral: registerUserByReferralReducer,
    getPercentages: getPercentagesReducer,
    verifyOTPData: verifyOTPReducer,
    resendOTPData: resendOTPReducer,
    editPercentages: editPercentagesReducer,
    getPackage: getPackagesReducer,
    addPackage: addPackageReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;

export type IRootState = ReturnType<typeof rootReducer>;

export default store;
