/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ApiState {
  isProxyError: boolean;
  isAvailable: boolean;
  isNetworkError: boolean;
}

const initialState: ApiState = {
  isProxyError: true,
  isAvailable: true,
  isNetworkError: false,
};

const apiStatusSlice = createSlice({
  name: 'apiStatus',
  initialState,
  reducers: {
    set: (state, { payload }: PayloadAction<ApiState>) => {
      state.isAvailable = payload.isAvailable;
      state.isProxyError = payload.isProxyError;
      state.isNetworkError = payload.isNetworkError;
    },
  },
});

const apiStatusReducer = apiStatusSlice.reducer;

const { set } = apiStatusSlice.actions;

export default apiStatusReducer;

export { apiStatusReducer, set as setApiStatus };
