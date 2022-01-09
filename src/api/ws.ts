import { useEffect } from "react";
import api, { models, ws } from ".";
import { Api } from "./apiImplementation";
import { API_URL } from "./client";

type ReconnectStrategy = (attempt: number) => number;

const defaultReconnectStrategy: ReconnectStrategy = (attempt) =>
  1000 * ([1, 5, 5, 10, 10, 10, 20, 20, 30, 30][attempt - 1] ?? 30);

type WSOptions = {
  reconnectStrategy?: (attempt: number) => number;
  wsTicketFactory?: () => Promise<string>;
  path: string;
};

export interface Subscription {
  unusubscribe(): void;
}

type WSState = {
  entries: string[];
};

export type EntryCallbackFunction<K extends keyof ws.EntryUpdateDataRegistry> =
  (data: ws.EntryUpdateDataTemplate<ws.EntryUpdateDataRegistry[K], K>) => void;

export default class WSClient {
  private _ws: WebSocket;
  private _opts: WSOptions;
  private _reconnectionAttempt: number = 0;
  private _reconnectionTimeout;
  private _sendMessageQueue: any[] = [];
  private _state: WSState = { entries: [] };
  private _entryListeners: Record<string, CallableFunction[]> = {};
  private _shouldReconnect: boolean = false;
  private _eventsListener?: (event: models.Event) => any;

  constructor(options: WSOptions) {
    this._opts = options;
  }

  get isConnected() {
    return (
      this._ws &&
      this._ws.readyState !== WebSocket.CLOSING &&
      this._ws.readyState !== WebSocket.CLOSED
    );
  }

  /**
   * Connect to the websocket, if already connected, do nothing
   */
  async connect() {
    if (
      !this._ws ||
      this._ws.readyState == WebSocket.CLOSED ||
      this._ws.readyState == WebSocket.CLOSING
    ) {
      this._connect();
      this._shouldReconnect = true;
    }
  }

  private async _connect() {
    if (this._ws && this._ws.readyState != WebSocket.CLOSED) return;

    const ticket = this._opts.wsTicketFactory
      ? await this._opts.wsTicketFactory()
      : undefined;
    this._ws = new WebSocket(
      this._opts.path + (ticket ? `?ticket=${encodeURIComponent(ticket)}` : "")
    );
    this._ws.addEventListener("close", () => this._onClose());
    this._ws.addEventListener("message", this._onMessage.bind(this));
  }

  private _onMessage(event: MessageEvent) {
    if (typeof event.data === "string") {
      let data: ws.InMessage;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data.msg_type == "new_event") {
        if (this._eventsListener) {
          this._eventsListener(data.data)
        } else {
          console.warn("receiving an event even though there's no event listener, weird...")
        }
      }
    }
  }

  private _onClose() {
    delete this._ws;
    console.debug("connection closed");
    if (!this._shouldReconnect) {
      // если мы сами закрыли сокет
      return;
    }
    this._reconnectionAttempt++;
    const timeout = (this._opts.reconnectStrategy ?? defaultReconnectStrategy)(
      this._reconnectionAttempt
    );
    if (this._reconnectionTimeout) clearTimeout(this._reconnectionTimeout);
    setTimeout(() => {
      this._connect();
    }, timeout);
  }

  subscribeToEntry<K extends keyof ws.EntryUpdateDataRegistry>(
    entry: K,
    id: string,
    listener: EntryCallbackFunction<K>
  ): Subscription {
    const entryKey: ws.EntryKey = `${entry}/${id}`;
    if (this._state.entries.indexOf(entryKey) == -1)
      this.send({ msg_type: "subscribe_entry", data: entryKey });

    let listeners = this._entryListeners[
      entryKey
    ] as typeof this._entryListeners[K];
    if (listeners) {
      if (listeners.indexOf(listener) == -1) {
        listeners.push(listener);
      }
    } else {
      this._entryListeners[entry] = [listener];
    }

    return {
      unusubscribe: () => {
        this.unsubscribeFromEntry(entry, id, listener);
      },
    };
  }

  unsubscribeFromEntry<K extends keyof ws.EntryUpdateDataRegistry>(
    entry: K,
    id: string,
    listener: EntryCallbackFunction<K>
  ) {
    const entryKey: ws.EntryKey = `${entry}/${id}`;
    const listerners = this._entryListeners[entryKey];
    if (!listerners)
      return;
    const indexOf = listerners.indexOf(listener);
    if (indexOf == -1) return;
    listerners.splice(indexOf);
    if (listerners.length == 0) {
      this.send({ msg_type: "unsubscribe_entry", data: entryKey });
      this._state.entries.splice(this._state.entries.indexOf(entryKey));
    }
  }

  subscribeToEvents(
    descriptor: ws.SubscribeEventsData,
    listener: (newEvent: models.Event) => any
  ) {
    if (this._eventsListener)
      throw new Error(
        "The events' listener is already defined you cannot have more than one listener at a time"
      );
    this.send({ msg_type: "subscribe_events", data: descriptor });
    this._eventsListener = listener;
  }

  unsubscribeFromEvents() {
    if (!this._eventsListener) return;
    delete this._eventsListener;
    this.send({ msg_type: "unsubscribe_events" });
  }

  close() {
    debugger;
    this._shouldReconnect = false;
    this._ws.close();
  }

  send(rawMessage: ws.OutMessage, queue: boolean = true) {
    const raw = JSON.stringify(rawMessage);
    if (!this._ws || this._ws.readyState != WebSocket.OPEN) {
      if (queue || this._ws?.readyState == WebSocket.CONNECTING) {
        this._sendMessageQueue.push(raw);
      } else {
        throw new Error("cannot send a message, websocket is not ready");
      }
    } else {
      this._ws.send(raw);
    }
  }
}
