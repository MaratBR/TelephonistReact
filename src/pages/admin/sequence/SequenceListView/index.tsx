import { useEffect, useState } from 'react';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import ErrorView from '@ui/Error';
import LoadingSpinner from '@ui/LoadingSpinner';
import PageHeader from '@ui/PageHeader';
import SelectableTag from '@ui/SelectableTag';
import { Stack } from '@ui/Stack';
import { rest } from 'api/definition';
import PaginationLayout from 'components/ui/PaginationLayout';
import SequenceCard from 'components/ui/SequenceCard';
import { useApi } from 'hooks';
import { usePageParam } from 'hooks/useSearchParam';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

const ALL_STATES: rest.SequenceState[] = [
  rest.SequenceState.FAILED,
  rest.SequenceState.FROZEN,
  rest.SequenceState.IN_PROGRESS,
  rest.SequenceState.SUCCEEDED,
];

export default function SequenceListView() {
  const [params, setParams] = useSearchParams();
  const { events } = useApi();
  const { t } = useTranslation();

  const appID = params.get('appID');
  const states = (params.get('state') ?? '').split('.').filter(rest.isSequenceState);
  const [page, setPage] = usePageParam();

  const [formFilter, setFormFilter] = useState<{ state: rest.SequenceState[]; app_id?: string }>({
    state: states.length ? states : ALL_STATES,
    app_id: undefined,
  });

  const {
    data: sequences,
    status,
    error,
  } = useQuery(['sequences', `appID=${appID};  states=${states.sort().join(',')}`, page], () =>
    events.getSequences({ page, state: states, page_size: 20 })
  );

  let content: React.ReactNode;

  if (status === 'error') {
    content = <ErrorView error={error} />;
  } else if (status === 'loading') {
    content = <LoadingSpinner />;
  } else if (sequences) {
    content = (
      <PaginationLayout onSelect={setPage} totalPages={sequences.pages_total} selectedPage={page}>
        {sequences.result.map((sequence) => (
          <SequenceCard sequence={sequence} />
        ))}
      </PaginationLayout>
    );
  }

  useEffect(() => {
    const newParams: Record<string, string> = {};
    if (formFilter.state.length < ALL_STATES.length) newParams.state = formFilter.state.join('.');
    setParams(newParams, { replace: true });
  }, [formFilter]);

  function toggleState(state: rest.SequenceState, isOn: boolean) {
    if (isOn) {
      if (formFilter.state.includes(state) || formFilter.state.length === 0) return;
      setFormFilter((filter) => ({ ...filter, state: filter.state.concat([state]) }));
    } else {
      if (formFilter.state.length === 1 && formFilter.state[0] === state) return;
      if (!formFilter.state.includes(state)) return;
      setFormFilter((filter) => ({ ...filter, state: filter.state.filter((s) => s !== state) }));
    }
  }

  return (
    <>
      <PageHeader title={t('sequence.plural')} />
      <Container>
        <ContentSection padded>
          <Stack h spacing="md">
            <SelectableTag
              onChange={(event) =>
                toggleState(rest.SequenceState.IN_PROGRESS, event.target.checked)
              }
              checked={
                formFilter.state.length === 0 ||
                formFilter.state.includes(rest.SequenceState.IN_PROGRESS)
              }
            >
              {t('sequenceState.in_progress')}
            </SelectableTag>
            <SelectableTag
              onChange={(event) => toggleState(rest.SequenceState.FAILED, event.target.checked)}
              checked={
                formFilter.state.length === 0 ||
                formFilter.state.includes(rest.SequenceState.FAILED)
              }
            >
              {t('sequenceState.failed')}
            </SelectableTag>
            <SelectableTag
              onChange={(event) => toggleState(rest.SequenceState.SUCCEEDED, event.target.checked)}
              checked={
                formFilter.state.length === 0 ||
                formFilter.state.includes(rest.SequenceState.SUCCEEDED)
              }
            >
              {t('sequenceState.succeeded')}
            </SelectableTag>
            {/*
              <SelectableTag
              onChange={(event) => toggleState(rest.SequenceState.FROZEN, event.target.checked)}
              checked={
                formFilter.state.length === 0 ||
                formFilter.state.includes(rest.SequenceState.FROZEN)
              }
            >
              {t('sequenceState.frozen')}
            </SelectableTag> */}
          </Stack>
          {content}
        </ContentSection>
      </Container>
    </>
  );
}
