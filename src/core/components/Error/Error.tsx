import S from './Error.module.scss';
import { useTranslation } from 'react-i18next';

interface ErrorProps {
  error: any;
}

export default function Error({ error }: ErrorProps) {
  const { t } = useTranslation();

  if (typeof error === 'undefined') return null;

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
      <span className={S.header}>{header}</span>
      {body}
    </div>
  );
}
