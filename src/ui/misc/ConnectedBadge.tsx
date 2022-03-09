import S from './ConnectedBadge.module.scss';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

interface ConnectedBadgeProps {
  connected: boolean;
}

export default function ConnectedBadge({ connected }: ConnectedBadgeProps) {
  const { t } = useTranslation();
  return (
    <span className={classNames(S.badge, { [S.connected]: connected })}>
      {connected ? t('connected') : t('disconnected')}
    </span>
  );
}
