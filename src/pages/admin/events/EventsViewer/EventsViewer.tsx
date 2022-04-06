import { useMemo, useState } from 'react';
import { renderDate } from '@ui/DataGrid';
import { Stack } from '@ui/Stack';
import Table from '@ui/Table';
import S from './EventsViewer.module.scss';
import { mdiArrowRight } from '@mdi/js';
import Icon from '@mdi/react';
import { Event } from 'api/definition';
import classNames from 'classnames';
import { Shruggie } from 'components/ui/misc';
import { throttle } from 'core/utils';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

type EventsViewerProps = {
  events: Event[];
  newEvents?: Event[];
};

interface EventRowProps {
  event: Event;
  index: number;
  selected: boolean;
  onSelectSequence: (sequenceID: string | null) => void;
}

function EventRow({ event, index, selected, onSelectSequence }: EventRowProps) {
  const { t } = useTranslation();
  return (
    <tr
      className={classNames(S.row, {
        [S.selectfed]: selected,
      })}
      key={event._id}
      onMouseLeave={() => onSelectSequence(null)}
      onMouseEnter={() => onSelectSequence(event.sequence_id)}
    >
      <td>{index + 1}</td>
      <td>
        <span className={S.key}>
          {event.event_type}
          {event.task_name ? <span className={S.task}>{`@${event.task_name}`}</span> : undefined}
        </span>
      </td>
      <td>{renderDate(event.created_at)}</td>
      <td>
        <code>{event.publisher_ip}</code>
      </td>
      <td>
        {event.sequence_id ? (
          <NavLink to={`/admin/sequences/${event.sequence_id}?bta=1`}>
            <Stack h alignItems="center">
              {t('sequence')}
              <Icon size={0.9} path={mdiArrowRight} />
            </Stack>
          </NavLink>
        ) : undefined}
      </td>
    </tr>
  );
}

function EventsViewer({ events, newEvents }: EventsViewerProps) {
  const { t } = useTranslation();

  const [sequenceID, setSequenceID] = useState<string | null>(null);
  const setSequenceIDThrottled = useMemo(() => throttle(setSequenceID, 250), []);

  const hRow = (
    <tr>
      <th>{t('#')}</th>
      <th>{t('eventKey')}</th>
      <th>{t('createdAt')}</th>
      <th>{t('ip')}</th>
    </tr>
  );

  let content: React.ReactNode;

  if (events.length || (newEvents && events.length)) {
    const mapFunction = (event: Event, index: number) => {
      return (
        <EventRow
          selected={event.sequence_id === sequenceID}
          event={event}
          index={index}
          onSelectSequence={setSequenceIDThrottled}
        />
      );
    };
    let elements = events.map(mapFunction);

    if (newEvents && newEvents.length) {
      elements = [
        ...newEvents.map(mapFunction),
        <tr>
          <td className={S.newEvents} colSpan={5}>
            {t('newEventsAbove')}
          </td>
        </tr>,
      ].concat(elements);
    }
    content = elements;
  } else {
    content = (
      <tr>
        <td colSpan={4}>
          <Shruggie>
            <p>{t('noEvents')}</p>
          </Shruggie>
        </td>
      </tr>
    );
  }

  return (
    <Table>
      <thead>{hRow}</thead>
      <tbody>{content}</tbody>
      <tfoot>{hRow}</tfoot>
    </Table>
  );
}

export default EventsViewer;
