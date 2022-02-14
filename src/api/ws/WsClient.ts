import { RegistryMessage } from "api/definition";
import { Events, newEventHandler } from "api/events";
import { Dispose, ListenerFunction } from "api/events/Events";
import WSClientBase from "./WsClientBase";

export default class WSClient<
  InEventsRegistry extends object,
  OutEventsRegistry extends object
> extends WSClientBase {
  private _sendMessageQueue: any[] = [];

  private _events = new Events<InEventsRegistry>();

  readonly connected = newEventHandler<Event>();

  readonly disconnected = newEventHandler<CloseEvent>();

  protected onMessage(event: MessageEvent<any>): void | Promise<void> {
    if (typeof event.data === 'string') {
      let message: RegistryMessage<InEventsRegistry>;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }
      this._events.dispatch(message.msg_type, message.data);
    }
  }

  on<K extends keyof InEventsRegistry>(
    event: K,
    listener: ListenerFunction<InEventsRegistry[K]>,
  ): Dispose {
    return this._events.addEventListener(event, listener);
  }

  off<K extends keyof InEventsRegistry>(
    event: K,
    listener: ListenerFunction<InEventsRegistry[K]>,
  ) {
    this._events.removeEventListener(event, listener);
  }

  send(
    rawMessage: RegistryMessage<OutEventsRegistry>,
    queue: boolean = true,
  ) {
    const raw = JSON.stringify(rawMessage);
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      if (queue || this.websocket?.readyState === WebSocket.CONNECTING) {
        this._sendMessageQueue.push(raw);
      } else {
        throw new Error('cannot send a message, websocket is not ready');
      }
    } else {
      this.websocket.send(raw);
    }
  }
}
