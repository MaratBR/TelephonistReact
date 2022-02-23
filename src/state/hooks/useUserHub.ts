import { useEffect } from 'react';
import useGlobalState from './useGlobalState';
import { UserHubWS } from 'api';

const noop = () => {};

export default function useUserHub(
  connect: boolean = true,
  init: (() => void) | undefined = undefined
): UserHubWS {
  const { ws } = useGlobalState();

  useEffect(() => {
    if (connect) {
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
  }, [connect]);

  return ws.hub;
}
