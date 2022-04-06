import AtTime from '@ui/AtTime';
import ErrorView from '@ui/Error';
import { Text } from '@ui/Text';
import PaginationLayout from 'components/ui/PaginationLayout';
import SequenceCard from 'components/ui/SequenceCard';
import { useApi } from 'hooks';
import { usePageParam } from 'hooks/useSearchParam';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

interface ViewApplicationSequencesProps {
  appID: string;
}

export default function ViewApplicationSequences({ appID }: ViewApplicationSequencesProps) {
  const api = useApi();
  const { t } = useTranslation();
  const [page, setPage] = usePageParam();

  const {
    data: pagination,
    error,
    status,
    dataUpdatedAt,
    isFetching,
  } = useQuery(['appSequences', appID, page], () => api.events.getSequences({ app_id: appID }), {
    keepPreviousData: true,
  });

  return (
    <>
      {status}
      <ErrorView error={error} />
      <Text type="hint">
        {t('lastUpdated')}: <AtTime at={dataUpdatedAt} />
      </Text>
      <PaginationLayout
        loading={isFetching}
        onSelect={setPage}
        selectedPage={page}
        totalPages={pagination?.pages_total ?? page}
      >
        {(pagination?.result ?? []).map((sequence) => (
          <SequenceCard sequence={sequence} />
        ))}
      </PaginationLayout>
    </>
  );
}
