import { useEffect, useState } from "react";

let hashQueryValue: Record<string, any> = {};

const eventTarget = new Comment(
  "This comment is a an event target for location.hash changes !!!DO NOT REMOVE!!!"
);
window.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(eventTarget);
});

function getHashString(value: Record<string, any>) {
  let parts = [];

  for (let [key, value] of Object.entries(hashQueryValue)) {
    value = JSON.stringify(value);
    parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
  }

  return parts.join("&");
}

export function setHashQuery(value: Record<string, any>) {
  let newValue = {
    ...hashQueryValue,
    ...value,
  };
  location.hash = getHashString(newValue);
  for (let key in Object.keys(value)) {
    eventTarget.dispatchEvent(new CustomEvent("hash_change:" + key));
  }
  hashQueryValue = newValue;
}

export function getHashValue(key: string) {
  return hashQueryValue[key];
}

export function useHashValue<T = string>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T>(hashQueryValue[key] ?? defaultValue);
  useHashValueChange(key, defaultValue, setValue);
  return value;
}

export function useHashValueChange<T>(
  key: string,
  defaultValue: T,
  listener: (value: T) => void
) {
  useEffect(() => {
    const listener_ = () => {
      listener(hashQueryValue[key] ?? defaultValue);
    };
    eventTarget.addEventListener("hash_change:" + key, listener_);
    return () =>
      eventTarget.removeEventListener("hash_change:" + key, listener_);
  }, []);
}
