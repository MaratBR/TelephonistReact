type ReconnectStrategy = (attempt: number) => number;

const defaultReconnectStrategy: ReconnectStrategy = (attempt) =>
  1000 * ([1, 5, 5, 10, 10, 10, 20, 20, 30, 30][attempt - 1] ?? 30);

export type WSOptions = {
  reconnectStrategy?: (attempt: number) => number;
  wsTicketFactory?: () => Promise<string>;
  path: string;
  reconnect?: boolean;
};

export default abstract class WSClientBase {
  protected readonly options: WSOptions;

  protected isConnected: boolean = false;

  protected isActivated: boolean = false;

  protected websocket: WebSocket | null = null;

  private _reconnectionTimeoutID: any | null = null;

  private _reconnectionAttempt: number = 0;

  constructor(options: WSOptions) {
    this.options = options;
    this._onOpen = this._onOpen.bind(this);
    this._onClose = this._onClose.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
  }

  protected getTicket(): Promise<string | null> {
    return this.options.wsTicketFactory
      ? this.options.wsTicketFactory()
      : Promise.resolve(null);
  }

  protected async modifyQuery(
    query: Record<string, string>
  ): Promise<Record<string, string>> {
    return {
      ...query,
      ticket: await this.getTicket(),
    };
  }

  async connect() {
    if (this.websocket) return;
    this._clearReconnection();

    const query = await this.modifyQuery({});
    this.websocket = new WebSocket(
      `${this.options.path}?${Object.entries(query)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')}`
    );

    this.websocket.addEventListener('close', this._onClose);
    this.websocket.addEventListener('error', this.onError);
    this.websocket.addEventListener('message', this.onMessage);
    this.websocket.addEventListener('open', this._onOpen);
  }

  private _clearReconnection() {
    if (this._reconnectionTimeoutID !== null) {
      clearTimeout(this._reconnectionTimeoutID);
      this._reconnectionTimeoutID = null;
    }
  }

  protected abstract onMessage(event: MessageEvent): void | Promise<void>;

  protected onError() {
    // eslint-disable-line class-methods-use-this
    /* no-op */
  }

  private _onOpen() {
    this.isConnected = true;
    this._reconnectionAttempt = 0;
  }

  private _onClose() {
    this.isConnected = false;
    if (this.options.reconnect ?? true) {
      this._reconnectionAttempt += 1;
      const timeout = (
        this.options.reconnectStrategy ?? defaultReconnectStrategy
      )(this._reconnectionAttempt);
      setTimeout(() => this.connect(), timeout);
    }
  }

  async reconnect() {
    if (this.websocket) {
      await this.disconnect();
    }
    await this.connect();
  }

  async disconnect() {
    this.websocket.close();
    this.websocket = null;
  }
}
