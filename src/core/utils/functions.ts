export function throttle<Args extends any[]>(
  fn: (...args: Args) => void,
  timeout: number
): (...args: Args) => void {
  let timeoutID;
  let args_: Args;
  let this_;

  const call = () => fn.call(this_, ...args_);

  return (...args) => {
    clearTimeout(timeoutID);
    args_ = args;
    timeoutID = setTimeout(call, timeout);
  };
}

export function throttleCollector<T>(
  maxCount: number,
  timeout: number,
  handler: (items: T[]) => void
): (item: T) => void {
  let items: T[] = [];
  let lastFlush = Date.now();

  return (item) => {
    items.push(item);
    if (items.length >= maxCount || lastFlush + timeout < Date.now()) {
      try {
        handler(items);
      } finally {
        items = [];
        lastFlush = Date.now();
      }
    }
  };
}

export function delay(fn: () => void, ms: number) {
  let lastCall = 0;

  return () => {
    if (lastCall + ms > Date.now()) return;
    lastCall = Date.now();
    fn();
  };
}
