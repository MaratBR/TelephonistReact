import S from './Error.module.scss';
import { mdiAlertCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';

interface ErrorProps {
  error: any;
}

export default function ErrorView({ error }: ErrorProps) {
  const { t } = useTranslation();

  if (typeof error === 'undefined' || error === null) return null;

  let header: React.ReactNode;
  let body: React.ReactNode;

  switch (typeof error) {
    case 'object':
      if (error === null) {
        header = t('unknownError');
        body = t('invalidError');
      } else {
        if (error.contructor && typeof error.constructor === 'function') {
          header = error.contructor.name ?? t('unknownError');
        }
        body = error.toString();
      }
      break;
    case 'string':
      header = t('genericError');
      body = error.toString();
      break;
    default:
      header = t('unknownError');
      break;
  }
  return (
    <div className={S.error}>
      <Icon color="var(--t-danger)" size={2} path={mdiAlertCircleOutline} />
      <div>
        <span className={S.header}>{header}</span>
        {body}
      </div>
    </div>
  );
}
