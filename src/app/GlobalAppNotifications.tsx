import { useEffect, useMemo } from 'react';
import S from './GlobalAppNotifications.module.scss';
import { useApi } from 'api/hooks';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

interface _Static {
  interval?: any;
}

function GlobalAppNotifications() {
  const api = useApi();
  const { t } = useTranslation();

  const _static = useMemo<_Static>(() => ({}), []);

  useEffect(() => {
    if (api.isOnline) {
      if (_static.interval) {
        clearInterval(_static.interval);
        _static.interval = undefined;
      }
    } else if (!_static.interval) {
      clearInterval(_static.interval);
      setTimeout(() => api.checkApi(), 500);
      _static.interval = setInterval(() => {
        api.checkApi();
      }, 20000);
    }
  }, [api.isOnline]);

  return (
    <div className={S.notifications}>
      {api.isOnline ? undefined : (
        <div className={`${S.notification} ${S.danger}`}>
          <h2>{t('serverIsNotAvailable')}</h2>
          <p>{t('sereverIsNotAvailableDetails')}</p>
        </div>
      )}
    </div>
  );
}

export default observer(GlobalAppNotifications);
