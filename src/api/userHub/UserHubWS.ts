import {
  InRegistryMessage,
  SyncState,
  UserHubIncomingMessages,
  UserHubOutgoingMessages,
} from 'api/definition';
import { WSClient } from 'api/ws';
import { WSOptions } from 'api/ws/WsClientBase';

export default class UserHubWS extends WSClient<UserHubIncomingMessages, UserHubOutgoingMessages> {
  private _topics: string[] = [];

  private _topicListeners: Record<string, Record<string, Function[]>> = {};

  constructor(opts?: WSOptions) {
    super(opts);
    this.addMessageListener('sync', this._onSync.bind(this));
    this.on('message', this._onMessage.bind(this));
  }

  setTopics(topics: string[]) {
    this._topics = topics;
    this.send({ t: 'set_topics', d: topics });
  }

  addTopic(topic: string[] | string) {
    this.send({ t: 'sub', d: topic });
  }

  removeTopic(topic: string[] | string) {
    this.send({ t: 'sub', d: topic });
  }

  protected onOpen(event: Event): void {
    super.onOpen(event);
    if (this._topics.length) this.send({ t: 'set_topics', d: this._topics });
    this.send({ t: 'cs', d: { href: window.location.href } });
  }

  private _onSync({ topics }: SyncState) {
    this._topics = topics;
  }

  private _onMessage(message: InRegistryMessage<UserHubIncomingMessages>) {
    if (message.topic) {
      const topicListeners = this._topicListeners[message.topic];
      if (topicListeners) {
        const listeners = topicListeners[message.t];
        if (listeners) {
          for (const listener of listeners) {
            listener(message.d);
          }
        }
      }
    }
  }

  addTopicListener(topic: string, eventName: string, listener: (event: any) => any) {
    if (!this._topicListeners[topic]) {
      this._topicListeners[topic] = {};
    }
    if (!this._topicListeners[topic][eventName]) {
      this._topicListeners[topic][eventName] = [listener];
    } else {
      this._topicListeners[topic][eventName].push(listener);
    }
  }

  removeTopicListener(topic: string, eventName: string, listener: (event: any) => any) {
    if (!this._topicListeners[topic]) return;
    const listeners = this._topicListeners[topic][eventName];
    if (!listeners) return;
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index);
      if (listener.length === 0) {
        delete this._topicListeners[topic][eventName];
      }
    }
  }
}
