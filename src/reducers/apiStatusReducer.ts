/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ApiState {
  isReachable: boolean;
  isOnline: boolean;
}

const initialState: ApiState = {
  isReachable: true,
  isOnline: true,
};

const apiStatusSlice = createSlice({
  name: 'apiStatus',
  initialState,
  reducers: {
    set: (state, { payload }: PayloadAction<ApiState>) => {
      state.isOnline = payload.isOnline;
      state.isReachable = payload.isReachable;
    },
  },
});

const apiStatusReducer = apiStatusSlice.reducer;

const { set } = apiStatusSlice.actions;

export default apiStatusReducer;

export { apiStatusReducer, set as setApiStatus };
