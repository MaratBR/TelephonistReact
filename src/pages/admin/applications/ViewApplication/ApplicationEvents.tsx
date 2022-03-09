import { useCallback, useEffect, useState } from 'react';
import Error from '@coreui/Error';
import { Checkbox } from '@coreui/Input';
import { Stack } from '@coreui/Stack';
import { Event } from 'api/definition';
import { useApi } from 'api/hooks';
import { throttleCollector } from 'core/utils';
import { observer } from 'mobx-react';
import Padded from 'pages/Padded';
import EventsViewer from 'pages/admin/events/EventsViewer';
import { useTranslation } from 'react-i18next';
import { useUserHub } from 'state/hooks';
import ConnectedBadge from 'ui/misc/ConnectedBadge';

interface ApplicationEventsProps {
  appID: string;
  maxEvents: number;
}

function ApplicationEvents({ appID, maxEvents }: ApplicationEventsProps) {
  const [active, setActive] = useState(true);
  const { events: eventsAPI } = useApi();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState();
  const { hub, connected } = useUserHub(active);
  const { t } = useTranslation();

  const refresh = useCallback(async () => {
    try {
      const { result } = await eventsAPI.getAll({ app_id: appID });
      setEvents(result);
    } catch (e) {
      setError(e);
    }
  }, [eventsAPI, appID]);
  const addEvent = useCallback(
    throttleCollector(10, 500, (newEvents: Event[]) => {
      setEvents((arr) =>
        arr.length + newEvents.length >= maxEvents
          ? [...newEvents, ...arr.slice(0, arr.length - newEvents.length)]
          : [...newEvents, ...arr]
      );
    }),
    []
  );

  useEffect(() => {
    if (active) {
      refresh();
      hub.addAppEventsListener(appID, addEvent);
      return () => hub.removeAppEventsListener(appID, addEvent);
    }
    return undefined;
  }, [active, appID]);

  return (
    <>
      <Padded>
        <Stack h alignItems="center" spacing="sm">
          <Checkbox checked={active} onChange={(e) => setActive(e.target.checked)} id="active" />
          <label htmlFor="active">{t('enableLiveUpdate')}</label>
          <ConnectedBadge connected={connected} />
        </Stack>
      </Padded>
      <Error error={error} />
      <EventsViewer events={events} />
    </>
  );
}

export default observer(ApplicationEvents);
