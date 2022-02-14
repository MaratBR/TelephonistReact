import { Dispose, ListenerFunction } from './Events';

export interface EventHandler<T> {
  dispatch(value: T): void;
  add(listener: ListenerFunction<T>): Dispose;
  remove(listener: ListenerFunction<T>): void;
}

class EventHandlerImpl<T> implements EventHandler<T> {
  private readonly _listeners: ListenerFunction<T>[] = [];

  dispatch(value: T): void {
    this._listeners.forEach((l) => l(value));
  }

  add(listener: ListenerFunction<T>): Dispose {
    this._listeners.push(listener);
    return this.remove.bind(this, listener);
  }

  remove(listener: ListenerFunction<T>): void {
    const index = this._listeners.indexOf(listener);
    if (index !== -1) this._listeners.splice(index);
  }
}

export function newEventHandler<T>() {
  return new EventHandlerImpl<T>();
}
