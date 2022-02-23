import { useCallback, useEffect, useState } from 'react';
import Error from '@coreui/Error';
import { Checkbox } from '@coreui/Input';
import { Stack } from '@coreui/Stack';
import { Event } from 'api/definition';
import { useApi } from 'api/hooks';
import { observer } from 'mobx-react';
import Padded from 'pages/Padded';
import EventsViewer from 'pages/events/EventsViewer';
import { useTranslation } from 'react-i18next';
import { useUserHub } from 'state/hooks';

interface ApplicationEventsProps {
  appID: string;
  maxEvents: number;
}

function ApplicationEvents({ appID, maxEvents }: ApplicationEventsProps) {
  const [active, setActive] = useState(true);
  const { events: eventsAPI } = useApi();
  const hub = useUserHub(active);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState();
  const { t } = useTranslation();

  const refresh = useCallback(async () => {
    try {
      const { result } = await eventsAPI.getAll({ app_id: appID });
      setEvents(result);
    } catch (e) {
      setError(e);
    }
  }, [eventsAPI, appID]);

  const addEvent = useCallback((event: Event) => {
    setEvents((arr) =>
      arr.length >= maxEvents ? [event, ...arr.slice(0, arr.length - 1)] : [event, ...arr]
    );
  }, []);

  useEffect(() => {
    if (active) {
      refresh();
      hub.addAppEventsListener(appID, addEvent);
    }
  }, [active, addEvent]);

  return (
    <>
      <Padded>
        <Stack h alignItems="center" spacing="sm">
          <Checkbox checked={active} onChange={(e) => setActive(e.target.checked)} id="active" />
          <label htmlFor="active">{t('enableLiveUpdate')}</label>
        </Stack>
      </Padded>
      <Error error={error} />
      <EventsViewer events={events} />
    </>
  );
}

export default observer(ApplicationEvents);
