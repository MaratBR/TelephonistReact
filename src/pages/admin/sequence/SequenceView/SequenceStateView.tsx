import React from 'react';
import S from './SequenceStateView.module.scss';
import { SequenceState } from 'api/definition';
import { useTranslation } from 'react-i18next';

function SequenceStateView({ state }: { state: SequenceState }) {
  const { t } = useTranslation();

  return <span className={`${S[state]} ${S.state}`}>{t(`sequenceState.${state}`)}</span>;
}

export default React.memo(SequenceStateView);
