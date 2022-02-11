import { Breadcrumb } from '@cc/Breadcrumb';
import { Stack } from '@cc/Stack';
import { TextHeader } from '@cc/Text';
import api from 'api';
import { useAsyncValue } from 'core/hooks';
import ContentLoader from 'react-content-loader';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';
import TaskGeneralInfo from './TaskGeneralInfo';
import TaskTriggers from './TaskTriggers';

export default function ViewApplicationTask() {
  const { t } = useTranslation();
  const { appID, taskID, name } = useParams();
  const { error, isLoading, value } = useAsyncValue(() => api.getApplicationTask(appID, taskID));

  if (isLoading) {
    return <ContentLoader />;
  }

  return (
    <>
      <Breadcrumb>
        <NavLink to="/applications">{t('applications')}</NavLink>
        <NavLink to={`/applications/${value.app._id}`}>
          {value.app.display_name}
        </NavLink>
        <span>{value.name}</span>
      </Breadcrumb>
      <TextHeader title={isLoading ? name ?? taskID : value.qualified_name} />
      <Stack spacing="md">
        <TaskGeneralInfo task={value} />
        <TaskTriggers task={value} />
      </Stack>
    </>
  );
}