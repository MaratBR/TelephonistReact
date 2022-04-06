import React, { useEffect, useMemo } from 'react';
import UserHubWS from './UserHubWS';
import { useApi } from 'hooks';
import { onWSStateChanged } from 'reducers/wsReducer';
import { useAppDispatch, useAppSelector } from 'store';

export const UserHubContext = React.createContext<UserHubWS | null>(null);

export function UserHubProvider({ children }: React.PropsWithChildren<{}>) {
  const api = useApi();
  const dispatch = useAppDispatch();

  const hub = useMemo(
    () =>
      new UserHubWS({
        path: `/_ws/user/main`,
        wsTicketFactory: () => api.issueWsTicket(),
        onStateChanged: (state) => dispatch(onWSStateChanged(state)),
      }),
    [api]
  );
  const { reservedConnections, topics } = useAppSelector((s) => ({
    reservedConnections: s.ws.reservationsCount,
    topics: s.ws.topics,
  }));

  useEffect(() => {
    if (reservedConnections > 0 !== hub.state.isEnabled) {
      if (hub.state.isEnabled) {
        hub.stop();
      } else {
        hub.start();
      }
    }
  }, [reservedConnections, hub]);

  useEffect(() => {
    hub.setTopics(Object.keys(topics));
  }, [topics]);

  return <UserHubContext.Provider value={hub}>{children}</UserHubContext.Provider>;
}
