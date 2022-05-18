import React from 'react';
import S from './SequenceStateView.module.scss';
import { rest } from 'api/definition';
import { useTranslation } from 'react-i18next';

function SequenceStateView({ state }: { state: rest.SequenceState }) {
  const { t } = useTranslation();

  return <span className={`${S[state]} ${S.state}`}>{t(`sequence.state.${state}`)}</span>;
}

export default React.memo(SequenceStateView);
