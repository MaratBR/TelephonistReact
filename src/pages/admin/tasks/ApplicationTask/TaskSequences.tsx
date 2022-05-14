import { useState } from 'react';
import ErrorView from '@ui/Error';
import { isNotFound } from 'api/utils';
import PaginationLayout from 'components/ui/PaginationLayout';
import SequenceCard from 'components/ui/SequenceCard';
import { Shruggie } from 'components/ui/misc';
import { useApi } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

interface TaskSequencesProps {
  taskID: string;
}

export default function TaskSequences({ taskID }: TaskSequencesProps) {
  const { tasks } = useApi();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const {
    data: sequences,
    status,
    error,
  } = useQuery(['taskSequences', taskID, page], () => tasks.getTaskSequences(taskID, { page }), {
    retry: (failureCount, err) => !isNotFound(err) && failureCount <= 3,
    keepPreviousData: true,
  });

  if (status === 'error') return <ErrorView error={error} />;
  if (status === 'success') {
    return (
      <PaginationLayout onSelect={setPage} totalPages={sequences.pages_total} selectedPage={page}>
        {sequences.result.length ? (
          sequences.result.map((sequence) => <SequenceCard sequence={sequence} />)
        ) : (
          <Shruggie>{t('sequencesNotFound')}</Shruggie>
        )}
      </PaginationLayout>
    );
  }
  return null;
}
