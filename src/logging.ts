// eslint-disable-next-line no-unused-vars
type LoggingFunction = (...args: any[]) => LoggingGlobal;
interface LoggingGlobal {
  info: LoggingFunction;
  error: LoggingFunction;
  debug: LoggingFunction;
  warn: LoggingFunction;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    logging: LoggingGlobal;
  }

  // eslint-disable-next-line no-unused-vars
  const logging: LoggingGlobal;
}

// eslint-disable-next-line no-unused-vars
const wrap =
  (fn: (...args: any[]) => void): LoggingFunction =>
  (...args) => {
    fn(...args);
    return window.logging;
  };

if (process.env.NODE_ENV === 'development') {
  // TODO: make separate eslint environments for prod and dev
  window.logging = {
    // eslint-disable-next-line no-console
    info: wrap(console.info),
    // eslint-disable-next-line no-console
    warn: wrap(console.warn),
    // eslint-disable-next-line no-console
    debug: wrap(console.debug),
    // eslint-disable-next-line no-console
    error: wrap(console.error),
  };
} else {
  const noop: LoggingFunction = () => window.logging;
  window.logging = {
    info: noop,
    // eslint-disable-next-line no-console
    warn: wrap(console.warn),
    debug: noop,
    // eslint-disable-next-line no-console
    error: wrap(console.error),
  };
}

const loggingInstance = window.logging;

export { loggingInstance };
