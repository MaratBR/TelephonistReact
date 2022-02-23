import WSClientBase from './WsClientBase';
import { RegistryMessage } from 'api/definition';
import { Events } from 'api/events';
import { Dispose, ListenerFunction } from 'api/events/Events';

interface ConnectedEvent {
  innerEvent: Event;
}

interface DisconnectEvent {
  innerEvent: CloseEvent;
}

interface ClientMessageEvent<Messages extends object> {
  message: RegistryMessage<Messages>;
}

interface ReadyEvent {}

interface WSEvents<Messages extends object> {
  connected: ConnectedEvent;
  disconnected: DisconnectEvent;
  message: ClientMessageEvent<Messages>;
  ready: ReadyEvent;
}

export default class WSClient<
  Messages extends object,
  OutMessages extends object,
  Events extends WSEvents<Messages> = WSEvents<Messages>
> extends WSClientBase {
  private _sendMessageQueue: any[] = [];

  private _events = new Events<Events>();

  private _messages = new Events<Messages>();

  protected onMessage(event: MessageEvent<any>): void | Promise<void> {
    if (typeof event.data === 'string') {
      let message: RegistryMessage<Messages>;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }
      this._events.dispatch('message', { message });
      this._messages.dispatch(message.msg_type, message.data);
    }
  }

  addMessageListener<K extends keyof Messages>(
    event: K,
    listener: ListenerFunction<Messages[K]>
  ): Dispose {
    return this._messages.addEventListener(event, listener);
  }

  removeMessageListener<K extends keyof Messages>(
    event: K,
    listener: ListenerFunction<Messages[K]>
  ) {
    this._messages.removeEventListener(event, listener);
  }

  on<K extends keyof Events>(event: K, listener: ListenerFunction<Events[K]>): Dispose {
    return this._events.addEventListener(event, listener);
  }

  off<K extends keyof Events>(event: K, listener: ListenerFunction<Events[K]>) {
    this._events.removeEventListener(event, listener);
  }

  send(rawMessage: RegistryMessage<OutMessages>, queue: boolean = true) {
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

  protected _onClose(event: CloseEvent): void {
    super._onClose(event);
    this._events.dispatch('disconnected', { innerEvent: event });
  }

  protected _onOpen(): void {
    super._onOpen();
    // we can some initialization here
    this._events.dispatch('ready', {});
  }
}
