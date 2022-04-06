import { ValueOf } from '../_utils';

export type OutMessage<T = any, TMessageType = string> = {
  t: TMessageType;
  d: T;
};

export type InMessage<T = any, TMessageType = string> = {
  t: TMessageType;
  d: T;
  topic: string;
};

interface Serializable {
  [x: string]: string | number | boolean | Date | Serializable | SerializableArray;
}
interface SerializableArray
  extends Array<string | number | boolean | Date | Serializable | SerializableArray> {}

export type OutRegistryMessage<Registry> = ValueOf<{
  [K in keyof Registry]: OutMessage<Registry[K], K>;
}>;

export type InRegistryMessage<Registry> = ValueOf<{
  [K in keyof Registry]: InMessage<Registry[K], K>;
}>;
