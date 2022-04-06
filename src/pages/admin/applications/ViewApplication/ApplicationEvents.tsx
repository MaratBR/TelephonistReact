import { useState } from 'react';
import ErrorView from '@ui/Error';
import { Checkbox } from '@ui/Input';
import { Stack } from '@ui/Stack';
import { Event } from 'api/definition';
import PaginationLayout from 'components/ui/PaginationLayout';
import ConnectedBadge from 'components/ui/misc/ConnectedBadge';
import { useApi } from 'hooks';
import { usePageParam } from 'hooks/useSearchParam';
import { useTopic } from 'hooks/useUserHub';
import Padded from 'pages/Padded';
import EventsViewer from 'pages/admin/events/EventsViewer';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useAppSelector } from 'store';

interface ApplicationEventsProps {
  appID: string;
  maxEvents: number;
}

function ApplicationEvents({ appID, maxEvents }: ApplicationEventsProps) {
  const [active, setActive] = useState(true);
  const isConnected = useAppSelector((s) => s.ws.isConnected);
  const api = useApi();

  const [page, setPage] = usePageParam();
  const [newEvents, setNewEvents] = useState<Event[]>([]);
  const {
    data: events,
    error,
    refetch,
  } = useQuery(['appEvents', appID, page], () => api.events.getAll({ app_id: appID, page }), {
    keepPreviousData: true,
    onSuccess: () => setNewEvents([]),
    refetchOnWindowFocus: false,
  });

  useTopic(active, `m/appEvents/${appID}`, (ctx) => {
    ctx.addEventListener('new_event', (event) => {
      setNewEvents([event, ...newEvents]);
      if (newEvents.length > 40) {
        refetch();
      }
    });
  });

  const { t } = useTranslation();

  return (
    <>
      <Padded>
        <Stack h alignItems="center" spacing="sm">
          <Checkbox checked={active} onChange={(e) => setActive(e.target.checked)} id="active" />
          <label htmlFor="active">{t('enableLiveUpdate')}</label>
          <ConnectedBadge connected={isConnected} />
        </Stack>
      </Padded>
      <ErrorView error={error} />
      <PaginationLayout
        onSelect={setPage}
        selectedPage={page}
        totalPages={events ? events.pages_total : page}
      >
        <EventsViewer newEvents={newEvents} events={events ? events.result : []} />
      </PaginationLayout>
    </>
  );
}

export default ApplicationEvents;
