import { IAuthApi } from 'api/apis/auth';
import { LoginRequest, LoginResponse, User } from 'api/definition';
import axios, { AxiosInstance } from 'axios';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

export default class AuthState {
  accessToken: string | null = null;

  isAuthorized: boolean = false;

  user: User | null = null;

  lastUsername: string | null = null;

  loginError: string | null = null;

  fetchUserError: string | null = null;

  isLoading: boolean = false;

  isPasswordResetRequired: boolean = false;

  passwordResetExpiresAt: number = -1;

  passwordResetToken: string | null = null;

  isInitialized: boolean = false;

  tokenExpiresAt: number = -1;

  resetPasswordError: any = null;

  private readonly _api: IAuthApi;

  private readonly _client: AxiosInstance;

  private _interceptorID?: number;

  constructor(authApi: IAuthApi, client: AxiosInstance) {
    this._client = client;
    this._api = authApi;
    makeObservable(this, {
      accessToken: observable,
      isAuthorized: observable,
      user: observable,
      lastUsername: observable,
      loginError: observable,
      fetchUserError: observable,
      isLoading: observable,
      isPasswordResetRequired: observable,
      passwordResetExpiresAt: observable,
      passwordResetToken: observable,
      isInitialized: observable,
      tokenExpiresAt: observable,
      resetPasswordError: observable,
    });
    makePersistable(this, {
      name: 'auth',
      storage: window.localStorage,
      properties: [
        'isAuthorized',
        'tokenExpiresAt',
        'user',
        'lastUsername',
        'accessToken',
        'passwordResetToken',
        'passwordResetExpiresAt',
        'isPasswordResetRequired',
      ],
    }).then(
      action(() => {
        this.initialize();
      })
    );
  }

  installInterceptor() {
    if (typeof this._interceptorID !== 'undefined') return;
    this._interceptorID = this._client.interceptors.request.use((config) => ({
      ...config,
      headers: {
        ...(config.headers ?? {}),
        authorization: this.accessToken ? `Bearer ${this.accessToken}` : undefined,
      },
    }));
  }

  async login(r: LoginRequest) {
    try {
      runInAction(() => {
        this.isLoading = true;
      });
      const data = await this._api.authorize(r);
      runInAction(() => this.handleLoginResponse(data));
    } catch (e) {
      runInAction(() => {
        this.loginError = e.toString();
      });
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  private handleLoginResponse(data: LoginResponse) {
    this.tokenExpiresAt = +new Date(data.exp);
    this.accessToken = data.access_token;
    this.isPasswordResetRequired = data.password_reset_required;
    this.passwordResetToken = data.password_reset_token;
    this.passwordResetExpiresAt = +new Date(data.exp); // add 10 min
    this.isAuthorized = !!data.access_token;
  }

  async fetchUser() {
    try {
      const user = await this._api.getUser();
      runInAction(() => {
        this.user = user;
      });
    } catch (e) {
      runInAction(() => {
        this.fetchUserError = e.toString();
      });
      throw e;
    }
  }

  async logout() {
    runInAction(() => this.handleLogout());
  }

  private handleLogout() {
    this.accessToken = null;
    this.lastUsername = this.user?.username || null;
    this.isAuthorized = false;
    this.isPasswordResetRequired = false;
    this.passwordResetToken = null;
    this.loginError = null;
    this.tokenExpiresAt = -1;
    this.fetchUserError = null;
  }

  async refreshToken() {
    try {
      const response = await this._api.refreshToken();
      runInAction(() => this.handleLoginResponse(response));
    } catch (e) {
      if (axios.isAxiosError(e) && e.response.status === 401) {
        runInAction(() => this.handleLogout());
      }
      throw e;
    }
  }

  async initialize() {
    this.installInterceptor();
    if (this.isAuthorized) {
      if (Date.now() > this.tokenExpiresAt) {
        try {
          await this.refreshToken();
        } catch {
          runInAction(() => this.handleLogout());
        }
      } else {
        try {
          await this.fetchUser();
        } catch (e) {
          if (axios.isAxiosError(e)) {
            runInAction(() => {
              this.isAuthorized = false;
            });
          }
        }
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
        }
      });
    }

    runInAction(() => {
      this.isInitialized = true;
    });
  }

  async resetPassword(newPassword: string) {
    if (!this.isPasswordResetRequired) {
      throw new Error(
        'invalid operation: cannot reset pasword since isPasswordResetRequired set to false'
      );
    }
    if (this.isLoading) {
      throw new Error(
        "another process is already happenning (i.e. logging in), can't do much for now"
      );
    }
    this.isLoading = true;
    try {
      await this._api.resetPassword({
        password_reset_token: this.passwordResetToken,
        new_password: newPassword,
      });
      runInAction(() => {
        this.isPasswordResetRequired = false;
        this.passwordResetToken = null;
        this.passwordResetExpiresAt = -1;
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.resetPasswordError = e;
        this.isLoading = false;
      });
      throw e;
    }
  }
}
