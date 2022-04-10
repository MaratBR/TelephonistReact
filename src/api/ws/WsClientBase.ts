type ReconnectStrategy = (attempt: number) => number;

const defaultReconnectStrategy: ReconnectStrategy = (attempt) =>
  1000 * ([1, 5, 5, 10, 10, 10, 20, 20, 30, 30][attempt - 1] ?? 30);

export interface WSClientState {
  isEnabled: boolean;
  state: 'connected' | 'disconnected' | 'connecting' | 'reconnecting';
}

export type WSOptions = {
  reconnectStrategy?: (attempt: number) => number;
  wsTicketFactory?: () => Promise<string>;
  url: URL;
  reconnect?: boolean;
  onStateChanged?: (state: WSClientState) => void;
};

export default abstract class WSClientBase {
  protected readonly options: WSOptions;

  state: WSClientState = {
    state: 'disconnected',
    isEnabled: false,
  };

  protected websocket: WebSocket | null = null;

  private _reconnectionTimeoutID: any | null = null;

  private _reconnectionAttempt: number = 0;

  constructor(options: WSOptions) {
    this.options = options;
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onWebsocketMessage = this.onWebsocketMessage.bind(this);
    this.onError = this.onError.bind(this);
  }

  protected getTicket(): Promise<string | null> {
    return this.options.wsTicketFactory ? this.options.wsTicketFactory() : Promise.resolve(null);
  }

  protected async modifyQuery(query: Record<string, string>): Promise<Record<string, string>> {
    return {
      ...query,
      ticket: await this.getTicket(),
    };
  }

  async start() {
    if (this.websocket) return;
    this._updateState({ state: 'connecting', isEnabled: true });
    this._clearReconnection();

    const query = await this.modifyQuery({});
    this.websocket = new WebSocket(
      `${this.options.url.toString()}?${Object.entries(query)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')}`
    );

    this.websocket.addEventListener('close', this.onClose);
    this.websocket.addEventListener('error', this.onError);
    this.websocket.addEventListener('message', this.onWebsocketMessage);
    this.websocket.addEventListener('open', this.onOpen);
  }

  private _clearReconnection() {
    if (this._reconnectionTimeoutID !== null) {
      clearTimeout(this._reconnectionTimeoutID);
      this._reconnectionTimeoutID = null;
    }
  }

  private _updateState(update: Partial<WSClientState>) {
    this.state = { ...this.state, ...update };
    if (this.options.onStateChanged) {
      this.options.onStateChanged(this.state);
    }
  }

  protected abstract onWebsocketMessage(event: MessageEvent): void | Promise<void>;

  protected onError() {}

  protected onOpen(_event: Event) {
    this._updateState({ state: 'connected' });
    this._reconnectionAttempt = 0;
  }

  protected onClose(_event: CloseEvent) {
    if (this.state.isEnabled && (this.options.reconnect ?? true)) {
      this._reconnectionAttempt += 1;
      const timeout = (this.options.reconnectStrategy ?? defaultReconnectStrategy)(
        this._reconnectionAttempt
      );
      setTimeout(() => this.start(), timeout);
      this._updateState({ state: 'reconnecting' });
    } else {
      this._updateState({ state: 'disconnected' });
    }
  }

  async reconnect() {
    if (this.websocket) {
      await this.stop();
    }
    await this.start();
  }

  async stop() {
    if (!this.state.isEnabled) return;
    this._updateState({ isEnabled: false });
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
}
