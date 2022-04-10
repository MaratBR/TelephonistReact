import { useState } from 'react';
import { Button } from '@ui/Button';
import { Parameters, StringValue } from '@ui/Parameters';
import Tags from '@ui/Tags';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import Icon from '@mdi/react';
import { Application } from 'api/definition';
import { useTranslation } from 'react-i18next';

type ApplicationInfoProps = {
  app: Application;
};

export default function ViewApplicationInfo({ app }: ApplicationInfoProps) {
  const [showKey, setShowKey] = useState(false);
  const { t } = useTranslation();
  return (
    <Parameters
      parameters={{
        [t('id')]: <code>{app._id}</code>,
        [t('name')]: <StringValue value={app.name} />,
        [t('description')]: <StringValue value={app.description} />,
        [t('accessKey')]: (
          <>
            <code>{showKey ? app.access_key : Array(app.access_key.length + 1).join('#')}</code>
            <Button
              variant="link"
              onClick={() => setShowKey(!showKey)}
              left={<Icon size={0.8} path={showKey ? mdiEyeOff : mdiEye} />}
            >
              {showKey ? t('hideKey') : t('showKey')}
            </Button>
          </>
        ),
        [t('tags')]: <Tags tags={app.tags} />,
      }}
    />
  );
}
