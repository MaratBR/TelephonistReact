/* eslint-disable no-param-reassign */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, rest } from 'api/definition';

interface AuthState {
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: rest.User | null;
  lastLogin: {
    username: string;
  } | null;
  csrfToken: string | null;
  passwordReset: {
    deadline: number;
    token: string;
  } | null;
  sRefID: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isInitialized: false,
  lastLogin: null,
  passwordReset: null,
  user: null,
  csrfToken: null,
  sRefID: null,
};

interface LogoutOptions {
  removeLastLogin?: boolean;
}

interface InitializationData {
  whoami: rest.WhoAmI;
  csrfToken: string;
}

interface APIThunkOptions {
  authAPI: api.IAuth;
}

export const initializeAuthThunk = createAsyncThunk(
  'auth/initializeAuthThunk',
  async ({ authAPI }: APIThunkOptions): Promise<InitializationData> => {
    const csrfToken = await authAPI.getCSRFToken();
    const whoami = await authAPI.whoami();

    return {
      whoami,
      csrfToken,
    };
  }
);

export const fetchUserThunk = createAsyncThunk(
  'auth/fetchUserThunk',
  async ({ authAPI }: APIThunkOptions): Promise<{ user: rest.User }> => {
    const whoami = await authAPI.whoami();

    return {
      user: whoami.user,
    };
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logoutThunk',
  async ({ authAPI }: APIThunkOptions): Promise<void> => {
    await authAPI.logout();
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state, { payload }: PayloadAction<LogoutOptions>) => {
      state.isLoggedIn = false;
      state.user = null;
      if (payload.removeLastLogin) {
        state.lastLogin = null;
      }
    },
    setLastLogin: (state, { payload: { username } }: PayloadAction<{ username: string }>) => {
      state.lastLogin = { username };
    },
    handleLoginResponse: (state, { payload }: PayloadAction<rest.LoginResponse>) => {
      if (rest.isPasswordReset(payload)) {
        state.isLoggedIn = false;
        state.passwordReset = {
          token: payload.password_reset.token,
          deadline: +new Date(payload.password_reset.exp),
        };
        state.user = null;
      } else {
        state.isLoggedIn = true;
        state.sRefID = payload.session_ref_id;
        state.user = payload.user;
        state.csrfToken = payload.csrf;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeAuthThunk.fulfilled, (state, { payload }) => {
      state.csrfToken = payload.csrfToken;
      state.isInitialized = true;
      state.isLoggedIn = true;
      state.user = payload.whoami.user;
      state.sRefID = payload.whoami.session_ref_id;
    });
    builder.addCase(initializeAuthThunk.rejected, (state) => {
      state.isLoggedIn = false;
      state.isInitialized = true;
      state.csrfToken = null;
    });

    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isLoggedIn = false;
      state.csrfToken = null;
    });

    builder.addCase(fetchUserThunk.fulfilled, (state, { payload: { user } }) => {
      state.user = user;
    });
  },
});

const authReducer = authSlice.reducer;

export const { logout, setLastLogin, handleLoginResponse } = authSlice.actions;

export default authReducer;
