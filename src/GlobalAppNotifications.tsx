import { useEffect, useMemo, useRef } from 'react';
import S from './GlobalAppNotifications.module.scss';
import { getApiURL } from 'api/context';
import { useApi } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';

interface _Static {
  interval?: any;
}

function GlobalAppNotifications() {
  const { t } = useTranslation();
  const api = useApi();
  const apiStatus = useAppSelector((state) => state.apiStatus);

  const _static = useMemo<_Static>(() => ({}), []);

  useEffect(() => {
    if (apiStatus.isAvailable) {
      if (_static.interval) {
        clearInterval(_static.interval);
        _static.interval = undefined;
      }
    } else {
      clearInterval(_static.interval);
      _static.interval = setInterval(() => {
        api.checkApi();
      }, 20000);
    }
  }, [apiStatus.isAvailable]);

  const ref = useRef<HTMLDivElement>();

  if (apiStatus.isAvailable) return null;

  return (
    <div className={S.notifications} ref={ref}>
      {apiStatus.isAvailable ? undefined : (
        <div className={`${S.notification} ${S.danger}`}>
          <h2>{t('serverUnavailable.header')}</h2>
          <p>{t('serverUnavailable.whatYouCanDo')}</p>
          <ul>
            <li>{t('serverUnavailable.solutions.running')}</li>
            <li>{t('serverUnavailable.solutions.ssl')}</li>
            <li>{t('serverUnavailable.solutions.cors')}</li>
            <li>{t('serverUnavailable.solutions.console')}</li>
          </ul>
          <p>
            {t('serverUnavailable.url')}{' '}
            <a target="_blank" href={getApiURL().toString()} rel="noreferrer">
              {getApiURL().toString()}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default GlobalAppNotifications;
