import { useState } from 'react';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import { Card } from '@ui/Card';
import Container from '@ui/Container';
import ErrorView from '@ui/Error';
import LoadingSpinner from '@ui/LoadingSpinner';
import { Stack } from '@ui/Stack';
import { TextHeader } from '@ui/Text';
import ValueCard from './ValueCard';
import SequenceCard from 'components/ui/SequenceCard';
import { useApi } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useAppSelector } from 'store';

export default function HomePage() {
  const api = useApi();
  const user = useAppSelector((s) => s.auth.user);
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const {
    data: stats,
    status,
    error,
  } = useQuery('stats', () => api.getStats(), { keepPreviousData: true, refetchInterval: 15000 });

  let content: React.ReactNode;
  if (status === 'loading') content = <LoadingSpinner />;
  else if (status === 'error') content = <ErrorView error={error} />;
  else {
    content = (
      <>
        <Card>
          <h3>{t('home.inLast24h')}</h3>
          <Stack h>
            <ValueCard name={t('home.seqInProgress')} value={stats.in_progress_sequences.count} />
            <ValueCard
              type={stats.counters.values.failed_sequences.day > 0 ? 'danger' : undefined}
              name={t('home.seqFail')}
              value={stats.counters.values.failed_sequences.day}
            />
            <ValueCard
              name={t('home.seqCompleted')}
              value={stats.counters.values.finished_sequences.day}
            />
            <ValueCard name={t('home.events')} value={stats.counters.values.events.day} />
          </Stack>

          <ButtonGroup>
            <Button onClick={() => setShowMore(!showMore)} color="primary" variant="ghost">
              {showMore ? t('less') : t('more')}
            </Button>
          </ButtonGroup>

          {showMore ? (
            <>
              <hr />
              <h3>{t('home.inTheLast')}</h3>
              <table>
                <tr>
                  <th>{t('home.week')}</th>
                  <th>{t('home.month')}</th>
                  <th>{t('home.year')}</th>
                </tr>
                <tr>
                  <td>
                    <ValueCard
                      type={stats.counters.values.failed_sequences.week > 0 ? 'danger' : undefined}
                      name={t('home.seqFail')}
                      value={stats.counters.values.failed_sequences.week}
                    />
                  </td>
                  <td>
                    <ValueCard
                      type={stats.counters.values.failed_sequences.week > 0 ? 'danger' : undefined}
                      name={t('home.seqFail')}
                      value={stats.counters.values.failed_sequences.month}
                    />
                  </td>
                  <td>
                    <ValueCard
                      type={stats.counters.values.failed_sequences.week > 0 ? 'danger' : undefined}
                      name={t('home.seqFail')}
                      value={stats.counters.values.failed_sequences.year}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <ValueCard
                      name={t('home.seqCompleted')}
                      value={stats.counters.values.finished_sequences.week}
                    />
                  </td>
                  <td>
                    <ValueCard
                      name={t('home.seqCompleted')}
                      value={stats.counters.values.finished_sequences.month}
                    />
                  </td>
                  <td>
                    <ValueCard
                      name={t('home.seqCompleted')}
                      value={stats.counters.values.finished_sequences.year}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <ValueCard name={t('home.events')} value={stats.counters.values.events.week} />
                  </td>
                  <td>
                    <ValueCard name={t('home.events')} value={stats.counters.values.events.month} />
                  </td>
                  <td>
                    <ValueCard name={t('home.events')} value={stats.counters.values.events.year} />
                  </td>
                </tr>
              </table>
            </>
          ) : undefined}
        </Card>
        <Card>
          <h3>{t('home.seqFailLast7D')}</h3>
          {stats.failed_sequences.list.length === 0 ? (
            t('home.noFailedRecently')
          ) : (
            <>
              {stats.failed_sequences.list.map((sequence) => (
                <SequenceCard sequence={sequence} />
              ))}
              <Button variant="ghost" to="/admin/sequences?state=failed">
                {t('more')}
              </Button>
            </>
          )}
        </Card>
        <Card>
          <h3>{t('home.seqInProgressLast7D')}</h3>
          {stats.in_progress_sequences.list.length ? (
            <>
              {stats.in_progress_sequences.list.map((seq) => (
                <SequenceCard sequence={seq} key={seq._id} />
              ))}
              <Button variant="ghost" to="/admin/sequences?state=in_progress">
                {t('more')}
              </Button>
            </>
          ) : (
            <p>{t('home.noSeqInProgress')}</p>
          )}
        </Card>
        <Card>
          <h3>{t('home.seqSuccessfulLast7D')}</h3>
          {stats.successful_sequences.list.length === 0 ? (
            t('home.noSuccessfulSequences')
          ) : (
            <>
              {stats.successful_sequences.list.map((sequence) => (
                <SequenceCard sequence={sequence} />
              ))}
              <Button variant="ghost" to="/admin/sequences?state=succeeded">
                {t('more')}
              </Button>
            </>
          )}
        </Card>
      </>
    );
  }

  return (
    <Container>
      <TextHeader title={t('hi', { name: user.username })} subtitle={t('home.welcomeBack')} />
      <Stack spacing="md">{content}</Stack>
    </Container>
  );
}
