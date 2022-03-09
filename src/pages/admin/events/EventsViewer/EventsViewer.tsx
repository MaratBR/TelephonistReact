import { useMemo, useState } from 'react';
import { renderDate } from '@coreui/DataGrid';
import { Stack } from '@coreui/Stack';
import Table from '@coreui/Table';
import S from './EventsViewer.module.scss';
import { mdiArrowRight } from '@mdi/js';
import Icon from '@mdi/react';
import { Event } from 'api/definition';
import classNames from 'classnames';
import { throttle } from 'core/utils';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Shruggie } from 'ui/misc';

type EventsViewerProps = {
  events: Event[];
};

function EventsViewer({ events }: EventsViewerProps) {
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

  if (events.length) {
    content = events.map((event, index) => {
      return (
        <tr
          className={classNames(S.row, {
            [S.selected]: event.sequence_id === sequenceID,
          })}
          key={event._id}
          onMouseLeave={() => setSequenceIDThrottled(null)}
          onMouseEnter={() => setSequenceIDThrottled(event.sequence_id)}
        >
          <td>{index + 1}</td>
          <td>
            <span className={S.key}>
              {event.event_type}
              {event.task_name ? (
                <span className={S.task}>{`@${event.task_name}`}</span>
              ) : undefined}
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
    });
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
