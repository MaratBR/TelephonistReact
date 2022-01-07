import { useTheme } from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";

type LoaderBarContextData = {
  readonly shown: boolean;
  readonly progress?: number;
  readonly color: string;
  setProgress(progress: number | undefined): void;
  setShown(shown: boolean): void;
  setColor(color: string): void;
};

const loaderBarContext = React.createContext<LoaderBarContextData | null>(null);
const Provider = loaderBarContext.Provider;

type LoaderBarFunction = (
  config?: "clear" | { progress?: number; color?: string }
) => void;

export function useLoaderBar(): LoaderBarFunction {
  const context = useContext(loaderBarContext);

  return (cfg) => {
    if (context == null) return;
    if (cfg === "clear") {
      context.setShown(false);
    } else {
      context.setShown(true);
      if (cfg) {
        if (cfg.progress) context.setProgress(cfg.progress);
        if (cfg.color) context.setColor(cfg.color);
      }
    }
  };
}

export const LoaderBarProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [state, setState] = useState<LoaderBarContextData>({
    shown: false,
    progress: undefined,
    color: useTheme().colors.primary[500],
    setShown: (shown) => setState((s) => ({ ...s, shown })),
    setProgress: (progress) => setState((s) => ({ ...s, progress })),
    setColor: (color) => setState((s) => ({ ...s, color })),
  });

  return (
    <Provider value={state}>
      <LoaderBar context={state} />
      {children}
    </Provider>
  );
};

type LoaderBarProps = {
  color: string;
  progress: number;
};

const UPDATE_TIMEOUT = 5;

function LoaderBar({ context }: { context: LoaderBarContextData }) {
  if (!context.shown) return null;

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (typeof context.progress === "undefined") {
      const now = Date.now();
      const interval = setInterval(() => {
        setProgress(100 * (1 - Math.exp(-(Date.now() - now) / 1000)));
      }, UPDATE_TIMEOUT);
      return () => clearInterval(interval);
    } else {
      setProgress(progress);
    }
  }, [context]);

  return <LoaderBarLine color={context.color} progress={progress} />;
}

function LoaderBarLine(props: LoaderBarProps) {
  const theme = useTheme();
  const color = theme.colors.primary[500];

  return ReactDOM.createPortal(
    <span
      style={{ transform: `scaleX(${props.progress}%)` }}
      css={[loaderBar, { backgroundColor: color }]}
    ></span>,
    document.body
  );
}

const loaderBar = css`
  position: fixed;
  height: 3px;
  width: 100%;
  top: 0;
  left: 0;
  background: var(--chakra-colors-primary);
  transform-origin: left;
`;
