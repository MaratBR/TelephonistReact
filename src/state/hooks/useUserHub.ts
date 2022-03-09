import { useEffect, useState } from 'react';
import useGlobalState from './useGlobalState';
import { UserHubWS } from 'api';

interface UseUserHub {
  hub: UserHubWS;
  connected: boolean;
}

const noop = () => {};

export default function useUserHub(
  active: boolean = true,
  init: (() => void) | undefined = undefined
): UseUserHub {
  const { ws } = useGlobalState();
  const [connected, setConnected] = useState(ws.hub.isConnected);

  useEffect(() => {
    const disposeDisconnect = ws.hub.on('disconnected', () => setConnected(false));
    const disposeConnect = ws.hub.on('connected', () => setConnected(true));

    return () => {
      disposeConnect();
      disposeDisconnect();
    };
  }, []);

  useEffect(() => {
    if (active) {
      const disposeHubRequest = ws.requestConnect();

      const onReady = () => {
        if (init) init();
      };
      ws.hub.on('ready', onReady);
      return () => {
        disposeHubRequest();
        ws.hub.off('ready', onReady);
      };
    }
    return noop;
  }, [active]);

  return {
    hub: ws.hub,
    connected,
  };
}
