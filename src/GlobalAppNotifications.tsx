import { useEffect, useMemo, useRef } from 'react';
import S from './GlobalAppNotifications.module.scss';
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
    if (apiStatus.isOnline) {
      if (_static.interval) {
        clearInterval(_static.interval);
        _static.interval = undefined;
      }
    } else {
      clearInterval(_static.interval);
      _static.interval = setInterval(() => {
        api.checkApi();
      }, 1000);
    }
  }, [apiStatus.isOnline]);

  const ref = useRef<HTMLDivElement>();

  if (!apiStatus.isOnline) return null;

  return (
    <div className={S.notifications} ref={ref}>
      {apiStatus.isOnline ? undefined : (
        <div className={`${S.notification} ${S.danger}`}>
          <h2>{t('serverIsNotAvailable')}</h2>
          <p>{t('serverIsNotAvailableDetails')}</p>
        </div>
      )}
    </div>
  );
}

export default GlobalAppNotifications;
