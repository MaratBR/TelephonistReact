import { ValueOf } from "../_utils";

export type Message<T = any, TMessageType = string> = {
  msg_type: TMessageType;
  data: T;
};

interface Serializable {
  [x: string]: string|number|boolean|Date|Serializable|SerializableArray;
}
interface SerializableArray
extends Array<string|number|boolean|Date|Serializable|SerializableArray> { }

export type RegistryMessage<Registry> = ValueOf<{
  [K in keyof Registry]: Message<Registry[K], K>
}>
