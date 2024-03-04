import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import { TypedUseSelectorHook, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import authReducer from './authSlice';
import { getAllUsersReducer, getUsersCountReducer, registerUserByReferralReducer } from './adminSlice';
import { addPercentagesReducer, getPercentagesReducer } from './levelSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    authReducer,
    getAllUsers: getAllUsersReducer,
    addPercentages: addPercentagesReducer,
    getUsersCount: getUsersCountReducer,
    registerByReferral: registerUserByReferralReducer,
    getPercentages: getPercentagesReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;

export type IRootState = ReturnType<typeof rootReducer>;

export default store;
