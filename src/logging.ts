type LoggingFunction = (...args: any[]) => LoggingGlobal;
interface LoggingGlobal {
  info: LoggingFunction;
  error: LoggingFunction;
  debug: LoggingFunction;
  warn: LoggingFunction;
}

declare global {
  interface Window {
    logging: LoggingGlobal;
  }

  const logging: LoggingGlobal;
}

const wrap = (fn: (...args: any[]) => void): LoggingFunction => {
  return (...args) => {
    fn(...args);
    return window.logging;
  };
};

if (process.env.NODE_ENV === "development") {
  window.logging = {
    info: wrap(console.info),
    warn: wrap(console.warn),
    debug: wrap(console.debug),
    error: wrap(console.error),
  };
} else {
  const noop: LoggingFunction = () => window.logging;
  window.logging = {
    info: noop,
    warn: wrap(console.warn),
    debug: noop,
    error: wrap(console.error),
  };
}

const loggingInstance = window.logging;

export { loggingInstance };
