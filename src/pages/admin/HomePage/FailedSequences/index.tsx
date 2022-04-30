import { Card } from '@ui/Card';
import S from './index.module.scss';
import { Sequence } from 'api/definition';
import SequenceCard from 'components/ui/SequenceCard';
import { useTranslation } from 'react-i18next';

interface FailedSequencesProps {
  sequences: Sequence[];
  totalCount: number;
}

export default function FailedSequences({ sequences, totalCount }: FailedSequencesProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <h3>
        {t('home.seqFail')}
        {sequences.length ? <span className={S.count}>{totalCount}</span> : undefined}
      </h3>
      {sequences.length === 0
        ? t('home.noFailedRecently')
        : sequences.map((sequence) => <SequenceCard sequence={sequence} />)}
    </Card>
  );
}
