export default function throttle<Args extends any[]>(
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
