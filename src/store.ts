import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import apiStatusReducer from 'reducers/apiStatusReducer';
import authReducer from 'reducers/authReducer';
import wsReducer from 'reducers/wsReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    apiStatus: apiStatusReducer,
    ws: wsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type RootState = ReturnType<typeof store.getState>;
export default store;
