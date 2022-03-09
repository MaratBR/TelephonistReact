export type ListenerFunction<T> = (value: T) => void;

type StringsOnly = { [key: string]: any };

export interface Dispose {
  (): void;
}

export class Events<Registry extends StringsOnly> {
  private readonly _listeners: Partial<Record<keyof Registry, Function[]>> = {};

  dispatch<K extends keyof Registry>(key: K, value: Registry[K]) {
    for (const listener of this._listeners[key] ?? []) listener(value);
  }

  addEventListener<K extends keyof Registry>(
    key: K,
    listener: ListenerFunction<Registry[K]>
  ): Dispose {
    const l = this._listeners[key];
    if (l) l.push(listener);
    else this._listeners[key] = [listener];
    return this.removeEventListener.bind(this, key, listener);
  }

  removeEventListener<K extends keyof Registry>(key: K, listener: ListenerFunction<Registry[K]>) {
    const l = this._listeners[key];
    if (l && l.includes(listener)) {
      if (l.length === 1) {
        this._listeners[key] = [];
      } else {
        l.splice(l.indexOf(listener));
      }
    }
  }
}
