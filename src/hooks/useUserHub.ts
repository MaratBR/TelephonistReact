import { useContext, useEffect } from 'react';
import { UserHubWS } from 'api';
import { UserHubIncomingMessages } from 'api/definition';
import { UserHubContext } from 'api/userHub/context';
import {
  cancelConnectionReservation,
  cancelTopicReservation,
  reserveConnection,
  reserveTopic,
} from 'reducers/wsReducer';
import { useAppDispatch } from 'store';

export interface UseTopicContext {
  addEventListener<K extends keyof UserHubIncomingMessages>(
    event: K,
    listener: (event: UserHubIncomingMessages[K]) => any
  ): void;
}

function useTopicWithHub(
  hub: UserHubWS,
  active: boolean,
  topicName: string,
  subscribeFunction: (context: UseTopicContext) => void
) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!active) return undefined;

    dispatch(reserveTopic(topicName));
    return () => {
      dispatch(cancelTopicReservation(topicName));
    };
  }, [topicName, active]);

  useEffect(() => {
    if (!active) return undefined;

    const subscribtions: Record<string, ((event: any) => any)[]> = {};

    subscribeFunction({
      addEventListener: (event, listener) => {
        hub.addTopicListener(topicName, event, listener);
        if (subscribtions[event]) {
          subscribtions[event].push(listener);
        } else {
          subscribtions[event] = [listener];
        }
      },
    });

    return () => {
      for (const [event, listeners] of Object.entries(subscribtions)) {
        for (const listener of listeners) {
          hub.removeTopicListener(topicName, event, listener);
        }
      }
    };
  }, [topicName, subscribeFunction, active]);

  return { hub };
}

export default function useUserHub(active: boolean = true) {
  const hub = useContext(UserHubContext);
  if (hub === null)
    throw new Error(
      'missing UserHub instance, did you forgot to wrap component tree with UserHubProvider?'
    );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!active) return undefined;
    dispatch(reserveConnection());

    return () => {
      dispatch(cancelConnectionReservation());
    };
  }, [active]);

  return hub;
}

export function useTopic(
  active: boolean,
  topicName: string,
  subscribeFunction: (context: UseTopicContext) => void
) {
  const hub = useUserHub(active);
  return useTopicWithHub(hub, active, topicName, subscribeFunction);
}
