import axios from "axios";
import { makeAutoObservable, action, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import api, { models, requests } from "~src/api";

export class AuthState {
  accessToken: string | null = null;
  isAuthorized: boolean = false;
  user: models.UserView | null = null;
  lastUsername: string | null = null;
  loginError: string | null = null;
  fetchUserError: string | null = null;
  isLoading: boolean = false;
  isPasswordResetRequired: boolean = false;
  passwordResetExpiresAt: number = -1;
  passwordResetToken: string | null = null;
  isInitialized: boolean = false;
  tokenExpiresAt: number = -1;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "auth",
      storage: window.localStorage,
      properties: [
        "isAuthorized",
        "tokenExpiresAt",
        "user",
        "lastUsername",
        "accessToken",
        "passwordResetToken",
        "passwordResetExpiresAt",
      ],
    }).then(
      action(() => {
        this.initialize();
      })
    );
  }

  async login(r: requests.Login) {
    try {
      runInAction(() => (this.isLoading = true));
      const data = await api.authorize(r);
      runInAction(() => this._loginState(data));
    } catch (e) {
      runInAction(() => {
        this.loginError = e.toString();
      });
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  private _loginState(data: models.LoginResponse) {
    this.accessToken = data.access_token;
    this.isPasswordResetRequired = data.password_reset_required;
    this.passwordResetToken = data.password_reset_token;
    if (this.passwordResetToken) {
      this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000; // add 10 min
    }
    this.isAuthorized = !!data.access_token;
  }

  async fetchUser() {
    try {
      const user = await api.getUser();
      runInAction(() => {
        this.user = user;
      });
    } catch (e) {
      runInAction(() => {
        this.fetchUserError = e.toString();
      });
    }
  }

  async logout() {
    runInAction(() => this._logoutState());
  }

  private _logoutState() {
    this.accessToken = null;
    this.lastUsername = this.user?.username || null;
    this.isAuthorized = false;
    this.isPasswordResetRequired = false;
    this.passwordResetToken = null;
    this.loginError = null;
    this.fetchUserError = null;
  }

  async refreshToken() {
    try {
      const response = await api.refreshToken();
      runInAction(() => this._loginState(response));
    } catch (e) {
      if (axios.isAxiosError(e) && e.response.status == 401) {
        runInAction(() => this._logoutState());
      }
    }
  }

  async initialize() {
    if (this.isAuthorized) {
      if (Date.now() > this.tokenExpiresAt) {
        try {
          await this.refreshToken();
        } catch {
          runInAction(() => this._logoutState());
        }
      } else {
        await this.fetchUser();
        runInAction(() => {
          this.isInitialized = true;
        });
      }
    } else if (this.passwordResetToken) {
      runInAction(() => {
        if (Date.now() > this.passwordResetExpiresAt) {
          this.passwordResetToken = null;
          this.isPasswordResetRequired = false;
          this.isPasswordResetRequired = false;
        } else {
          this.passwordResetToken = null;
          this.passwordResetExpiresAt = -1;
          this.isPasswordResetRequired = false;
        }
      });
    }

    runInAction(() => {
      this.isInitialized = true;
    });
  }
}

const authState = new AuthState();
export default authState;
