import { useMemo } from 'react';
import S from './SequenceMetaBar.module.scss';
import { SequenceState, toSequenceMeta } from 'api/definition';
import LoadingBar from 'core/LoaderBar';

interface SequenceMetaBarProps {
  meta: Record<string, any>;
  state: SequenceState;
}

export default function SequenceMetaBar({ meta: rawMeta, state }: SequenceMetaBarProps) {
  const meta = useMemo(() => toSequenceMeta(rawMeta), [rawMeta]);

  if (state === 'succeeded') return null;
  if (state === 'failed') return <div className={S.error} />;

  return (
    <>
      <div className={S.info}>
        <span>{meta.description}</span>
        <span>
          {meta.steps_done ?? '?'}/{meta.steps_total ?? '?'}
        </span>
        <span>{meta.progress}%</span>
      </div>
      <LoadingBar progress={meta.progress} indetermined={typeof meta.progress === 'undefined'} />
    </>
  );
}
