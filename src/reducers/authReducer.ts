/* eslint-disable no-param-reassign */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IAuthApi } from 'api/apis/auth';
import { LoginResponse, User, WhoAmI, isPasswordReset } from 'api/definition';
import { PersistConfig } from 'redux-persist';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

interface AuthState {
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: User | null;
  lastLogin: {
    username: string;
  } | null;
  csrfToken: string | null;
  passwordReset: {
    deadline: number;
    token: string;
  } | null;
  isLoggingIn: boolean;
  sRefID: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isInitialized: false,
  lastLogin: null,
  passwordReset: null,
  user: null,
  isLoggingIn: false,
  csrfToken: null,
  sRefID: null,
};

interface LogoutOptions {
  removeLastLogin?: boolean;
}

interface InitializationData {
  whoami: WhoAmI;
  csrfToken: string;
}

interface APIThunkOptions {
  authAPI: IAuthApi;
}

const initializeAuthThunk = createAsyncThunk(
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

const logoutThunk = createAsyncThunk(
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
    handleLoginResponse: (state, { payload }: PayloadAction<LoginResponse>) => {
      if (isPasswordReset(payload)) {
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
    setLastLogin: (state, { payload: { username } }: PayloadAction<{ username: string }>) => {
      state.lastLogin = { username };
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
  },
});

const authReducer = authSlice.reducer;

const { logout, handleLoginResponse, setLastLogin } = authSlice.actions;

const persistConfig: PersistConfig<AuthState> = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export default persistedAuthReducer;

export { logout, handleLoginResponse, setLastLogin, initializeAuthThunk, logoutThunk };
