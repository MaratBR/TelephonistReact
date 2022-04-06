/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WSClientState } from 'api/ws/WsClientBase';

interface WSState {
  isConnected: boolean;
  reservationsCount: number;
  patianceTimeout: number;
  topics: Record<string, number>;
}

const initialState: WSState = {
  isConnected: false,
  reservationsCount: 0,
  patianceTimeout: 10000,
  topics: {},
};

const wsSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    reserveConnection: (state) => {
      state.reservationsCount += 1;
    },
    cancelConnectionReservation: (state) => {
      state.reservationsCount -= 1;
    },
    reserveTopic: (state, { payload }: PayloadAction<string | string[]>) => {
      const topics = typeof payload === 'string' ? [payload] : payload;
      for (const topic of topics) {
        if (state.topics[topic]) {
          state.topics[topic] += 1;
        } else {
          state.topics[topic] = 1;
        }
        state.reservationsCount += 1;
      }
    },
    cancelTopicReservation: (state, { payload }: PayloadAction<string | string[]>) => {
      const topics = typeof payload === 'string' ? [payload] : payload;
      for (const topic of topics) {
        if (state.topics[topic]) {
          if (state.topics[topic] === 1) {
            delete state.topics[topic];
          } else {
            state.topics[topic] -= 1;
          }
        }
        state.reservationsCount -= 1;
      }
    },
    onWSStateChanged: (state, { payload }: PayloadAction<WSClientState>) => {
      state.isConnected = payload.state === 'connected';
    },
  },
});

const wsReducer = wsSlice.reducer;

export default wsReducer;

export const {
  reserveConnection,
  cancelConnectionReservation,
  reserveTopic,
  cancelTopicReservation,
  onWSStateChanged,
} = wsSlice.actions;
