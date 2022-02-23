import { useState } from 'react';
import { Button } from '@coreui/Button';
import { Parameters, StringValue } from '@coreui/Parameters';
import { Stack } from '@coreui/Stack';
import Tags from '@coreui/Tags';
import { Heading } from '@coreui/Text';
import { mdiEye, mdiEyeOff, mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { Application } from 'api/definition';
import Padded from 'pages/Padded';
import { useTranslation } from 'react-i18next';

type ApplicationInfoProps = {
  app: Application;
};

export default function ViewApplicationInfo({ app }: ApplicationInfoProps) {
  const [showKey, setShowKey] = useState(false);
  const { t } = useTranslation();
  return (
    <Padded>
      <Stack h>
        <Button to={`/applications/${app.name}/edit`} left={<Icon size={0.9} path={mdiPencil} />}>
          {t('edit')}
        </Button>
      </Stack>
      <Heading as="h3">{t('generalInformation')}</Heading>
      <Parameters
        parameters={{
          [t('id')]: <code>{app._id}</code>,
          [t('name')]: <StringValue value={app.name} />,
          [t('description')]: <StringValue value={app.description} />,
          [t('accessKey')]: (
            <>
              <code>{showKey ? app.access_key : 'application.################'}</code>
              <br />
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
    </Padded>
  );
}
