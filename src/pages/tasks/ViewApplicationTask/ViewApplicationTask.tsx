import { useCallback, useState } from 'react';
import { Breadcrumb } from '@coreui/Breadcrumb';
import Error from '@coreui/Error';
import { TextHeader } from '@coreui/Text';
import TaskInfoSection from './TaskInfoSection';
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
  const { appName, taskName } = useParams();
  const { error, isLoading, value, setValue } = useRefreshableAsyncValue(() =>
    api.tasks.getByName(appName, taskName)
  );
  const [savingTriggers, setSavingTriggers] = useState(false);
  const [savingTriggersError, setSavingTriggersError] = useState();

  const saveTriggers = useCallback(
    async (triggers: TaskTrigger[]) => {
      if (savingTriggers || !value) return;
      setSavingTriggers(true);
      try {
        const newTask = await api.tasks.update(value._id, { triggers });
        logging.warn('saved new triggers, setValue(...)', newTask);
        setValue(newTask);
      } catch (e) {
        setSavingTriggersError(e);
      } finally {
        setSavingTriggers(false);
      }
    },
    [savingTriggers, value]
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  logging.warn('rendering ViewApplicationTask, triggers = ', value.triggers);

  return (
    <>
      <Breadcrumb>
        <NavLink to="/applications">{t('applications')}</NavLink>
        <NavLink to={`/applications/${value.app.name}`}>{appName}</NavLink>
        <span>{taskName}</span>
      </Breadcrumb>
      <TextHeader title={`${appName}/${taskName}`} />
      <Error error={error} />
      <TaskInfoSection task={value} />
      <TaskTriggers triggers={value.triggers} taskID={value._id} onSave={saveTriggers} />
    </>
  );
}
