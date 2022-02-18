import { useEffect, useState } from 'react';

let hashQueryValue: Record<string, any> = {};

const eventTarget = new Comment(
  'This comment is a an event target for location.hash changes !!!DO NOT REMOVE!!!'
);
window.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(eventTarget);
});

function getHashString(value: Record<string, any>) {
  const parts = [];

  Object.entries(value).forEach(([key, v]) => {
    const strValue = JSON.stringify(v);
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(strValue)}`);
  });

  return parts.join('&');
}

export function setHashQuery(value: Record<string, any>) {
  const newValue = {
    ...hashQueryValue,
    ...value,
  };
  window.location.hash = getHashString(newValue);
  Object.keys(value).forEach((key) =>
    eventTarget.dispatchEvent(new CustomEvent(`hash_change:${key}`))
  );
  hashQueryValue = newValue;
}

export function getHashValue(key: string) {
  return hashQueryValue[key];
}

export function useHashValueChange<T>(key: string, defaultValue: T, listener: (value: T) => void) {
  useEffect(() => {
    const listener_ = () => {
      listener(hashQueryValue[key] ?? defaultValue);
    };
    eventTarget.addEventListener(`hash_change:${key}`, listener_);
    return () => eventTarget.removeEventListener(`hash_change:${key}`, listener_);
  }, []);
}

export function useHashValue<T = string>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T>(hashQueryValue[key] ?? defaultValue);
  useHashValueChange(key, defaultValue, setValue);
  return value;
}
