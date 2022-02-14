import { Breadcrumb } from '@ui/Breadcrumb';
import { TextHeader } from '@ui/Text';
import TaskGeneralInfo from './TaskGeneralInfo';
import TaskTriggers from './TaskTriggers';
import api from 'api';
import { useRefreshableAsyncValue } from 'core/hooks';
import ContentLoader from 'react-content-loader';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';

export default function ViewApplicationTask() {
  const { t } = useTranslation();
  const { appID, taskID, name } = useParams();
  const { error, isLoading, value } = useRefreshableAsyncValue(() =>
    api.getApplicationTask(appID, taskID)
  );

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
      <TaskGeneralInfo task={value} />
      <TaskTriggers task={value} />
    </>
  );
}
