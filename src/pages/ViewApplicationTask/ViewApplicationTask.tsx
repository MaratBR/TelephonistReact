import { useCallback, useState } from 'react';
import { Breadcrumb } from '@ui/Breadcrumb';
import { TextHeader } from '@ui/Text';
import TaskGeneralInfo from './TaskGeneralInfo';
import TaskTriggers from './TaskTriggers';
import { TaskTrigger } from 'api/definition';
import { useApi } from 'api/hooks';
import { useRefreshableAsyncValue } from 'core/hooks';
import ContentLoader from 'react-content-loader';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';

export default function ViewApplicationTask() {
  const { t } = useTranslation();
  const api = useApi();
  const { appID, taskID, name } = useParams();
  const { error, isLoading, value, setValue } = useRefreshableAsyncValue(() =>
    api.getApplicationTask(appID, taskID)
  );
  const [savingTriggers, setSavingTriggers] = useState(false);
  const [savingTriggersError, setSavingTriggersError] = useState();

  const saveTriggers = useCallback(
    async (triggers: TaskTrigger[]) => {
      if (savingTriggers) return;
      setSavingTriggers(true);
      try {
        setValue(await api.updateApplicationTask(appID, taskID, { triggers }));
      } catch (e) {
        setSavingTriggersError(e);
      } finally {
        setSavingTriggers(false);
      }
    },
    [savingTriggers]
  );

  const appName = value ? value.app.display_name : t('loading');
  const taskName = value?.name ?? t('loading');

  if (isLoading) {
    return <ContentLoader />;
  }

  return (
    <>
      <Breadcrumb>
        <NavLink to="/applications">{t('applications')}</NavLink>
        <NavLink to={`/applications/${value.app._id}`}>{appName}</NavLink>
        <span>{taskName}</span>
      </Breadcrumb>
      <TextHeader title={isLoading ? name ?? taskID : value.qualified_name} />
      <TaskGeneralInfo task={value} />
      <TaskTriggers onSave={saveTriggers} task={value} />
    </>
  );
}
