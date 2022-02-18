export type ListenerFunction<T> = (value: T) => void;

type StringsOnly = { [key: string]: any };

export interface Dispose {
  (): void;
}

export class Events<Registry extends StringsOnly> {
  private readonly _node: EventTarget;

  private readonly _id: string;

  constructor() {
    this._id = Math.random().toString(36).substring(2);
    this._node = new Comment('EVENT NODE, DO NOT DELETE');
  }

  dispatch<K extends keyof Registry>(key: K, value: Registry[K]) {
    this._node.dispatchEvent(new CustomEvent(key as string, { detail: value }));
  }

  addEventListener<K extends keyof Registry>(
    key: K,
    listener: ListenerFunction<Registry[K]>
  ): Dispose {
    this._node.addEventListener(key as string, listener);
    return this.removeEventListener.bind(this, key, listener);
  }

  removeEventListener<K extends keyof Registry>(key: K, listener: ListenerFunction<Registry[K]>) {
    this._node.removeEventListener(key as string, listener);
  }

  once<K extends keyof Registry>(key: K, listener: ListenerFunction<Registry[K]>) {
    this._node.addEventListener(key as string, listener, { once: true });
  }
}
