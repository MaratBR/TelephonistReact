import { Card } from '@ui/Card';
import Container from '@ui/Container';
import ErrorView from '@ui/Error';
import LoadingSpinner from '@ui/LoadingSpinner';
import { Stack } from '@ui/Stack';
import { TextHeader } from '@ui/Text';
import FailedSequences from './FailedSequences';
import ValueCard from './ValueCard';
import { useApi } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useAppSelector } from 'store';

export default function HomePage() {
  const api = useApi();
  const user = useAppSelector((s) => s.auth.user);
  const { t } = useTranslation();
  const { data: stats, status, error } = useQuery('stats', () => api.getStats());

  let content: React.ReactNode;
  if (status === 'loading') content = <LoadingSpinner />;
  else if (status === 'error') content = <ErrorView error={error} />;
  else {
    const segments = [];
    const isSomethingWrong = stats.counters.values.failed_sequences.day > 0;
    segments.push(
      <Card>
        <h3>{t('inLast24h')}</h3>
        <Stack h>
          <ValueCard
            type={stats.counters.values.failed_sequences.day > 0 ? 'danger' : undefined}
            name={t('failedSequences')}
            value={stats.counters.values.failed_sequences.day}
          />
          <ValueCard
            name={t('completedSequences')}
            value={stats.counters.values.finished_sequences.day}
          />
          <ValueCard name={t('events')} value={stats.counters.values.events.day} />
        </Stack>
      </Card>
    );

    segments.push(<FailedSequences key="sequences" sequences={stats.failed_sequences} />);
    content = segments;
  }

  return (
    <Container>
      <TextHeader title={t('hi', { name: user.username })} subtitle={t('welcomeBack')} />
      <Stack spacing="md">{content}</Stack>
    </Container>
  );
}
