import { ws } from ".";
import { Events, Dispose, ListenerFunction, newEventHandler } from "./events";

type ReconnectStrategy = (attempt: number) => number;

const defaultReconnectStrategy: ReconnectStrategy = (attempt) =>
  1000 * ([1, 5, 5, 10, 10, 10, 20, 20, 30, 30][attempt - 1] ?? 30);

export type WSOptions = {
  reconnectStrategy?: (attempt: number) => number;
  wsTicketFactory?: () => Promise<string>;
  path: string;
  reconnect?: boolean;
};

export abstract class WSClientBase {
  protected readonly options: WSOptions;
  protected isConnected: boolean = false;
  protected isActivated: boolean = false;
  protected websocket: WebSocket | null = null;
  private _reconnectionTimeoutID: NodeJS.Timeout | null = null;
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

  protected async modifyQuery(query: Record<string, string>): Promise<void> {
    query.ticket = await this.getTicket();
  }

  async connect() {
    if (this.websocket) return;
    this._clearReconnection();

    const query: Record<string, string> = {};
    await this.modifyQuery(query);
    this.websocket = new WebSocket(
      this.options.path +
        "?" +
        Object.entries(query)
          .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
          .join("&")
    );

    this.websocket.addEventListener("close", this._onClose);
    this.websocket.addEventListener("error", this.onError);
    this.websocket.addEventListener("message", this.onMessage);
    this.websocket.addEventListener("open", this._onOpen);
  }

  private _clearReconnection() {
    if (this._reconnectionTimeoutID !== null) {
      clearTimeout(this._reconnectionTimeoutID);
      this._reconnectionTimeoutID = null;
    }
  }

  protected abstract onMessage(event: MessageEvent): void | Promise<void>;

  protected onError() {}

  private _onOpen() {
    this.isConnected = true;
    this._reconnectionAttempt = 0;
  }

  private _onClose() {
    this.isConnected = false;
    if (this.options.reconnect ?? true) {
      this._reconnectionAttempt++;
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

export default class WSClient<
  InEventsRegistry extends object,
  OutEventsRegistry extends object
> extends WSClientBase {
  private _sendMessageQueue: any[] = [];
  private _events = new Events<InEventsRegistry>();

  readonly connected = newEventHandler<Event>();
  readonly disconnected = newEventHandler<CloseEvent>();

  protected onMessage(event: MessageEvent<any>): void | Promise<void> {
    if (typeof event.data === "string") {
      let message: ws.RegistryMessage<InEventsRegistry>;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }
      message.data;
      this._events.dispatch(message.msg_type, message.data);
    }
  }

  on<K extends keyof InEventsRegistry>(
    event: K,
    listener: ListenerFunction<InEventsRegistry[K]>
  ): Dispose {
    return this._events.addEventListener(event, listener);
  }

  off<K extends keyof InEventsRegistry>(
    event: K,
    listener: ListenerFunction<InEventsRegistry[K]>
  ) {
    this._events.removeEventListener(event, listener);
  }

  send(
    rawMessage: ws.RegistryMessage<OutEventsRegistry>,
    queue: boolean = true
  ) {
    const raw = JSON.stringify(rawMessage);
    if (!this.websocket || this.websocket.readyState != WebSocket.OPEN) {
      if (queue || this.websocket?.readyState == WebSocket.CONNECTING) {
        this._sendMessageQueue.push(raw);
      } else {
        throw new Error("cannot send a message, websocket is not ready");
      }
    } else {
      this.websocket.send(raw);
    }
  }
}
