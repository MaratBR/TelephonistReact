import { useCallback } from 'react';
import ContentSection from '@coreui/ContentSection';
import ErrorView from '@coreui/Error';
import LoadingSpinner from '@coreui/LoadingSpinner';
import { TextHeader } from '@coreui/Text';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@coreui/tabs';
import ApplicationEvents from './ApplicationEvents';
import ViewApplicationInfo from './ViewApplicationInfo';
import { TaskStandalone } from 'api/definition';
import { useApi } from 'api/hooks';
import { Breadcrumb } from 'core/components/Breadcrumb';
import { useRefreshableAsyncValue } from 'core/hooks';
import { observer } from 'mobx-react';
import ConnectionsView from 'pages/applications/ConnectionsView';
import ApplicationTasks from 'pages/applications/TasksView/TasksView';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';

function ViewApplication() {
  const { id } = useParams();
  const api = useApi();
  const { value, isLoading, error, setValue, refresh } = useRefreshableAsyncValue(
    () => api.applications.get(id),
    [id]
  );
  const name = isLoading ? id : value.app.display_name;
  const { t } = useTranslation();

  const onTaskDeleted = useCallback(
    (taskID: string) => {
      refresh(true);
      setValue({
        ...value,
        tasks: value.tasks.filter((task) => task._id !== taskID),
      });
    },
    [value]
  );

  const onTaskAdded = useCallback(
    (task: TaskStandalone) => {
      // do optimistic update for now
      refresh(true);
      setValue({
        ...value,
        tasks: [
          ...value.tasks,
          {
            ...task,
            app_id: task.app._id,
            app_name: task.app.name,
          },
        ],
      });
    },
    [value]
  );

  let content: React.ReactNode;

  if (isLoading) {
    content = <LoadingSpinner size={2} />;
  } else {
    content = (
      <ContentSection header={t('information')}>
        <Tabs>
          <TabList>
            <Tab>{t('general')}</Tab>
            <Tab>{t('tasks')}</Tab>
            <Tab>{t('connections')}</Tab>
            <Tab>{t('events')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ViewApplicationInfo app={value.app} />
            </TabPanel>

            <TabPanel>
              <ApplicationTasks
                appID={id}
                tasks={value.tasks}
                onTaskDeleted={onTaskDeleted}
                onTaskAdded={onTaskAdded}
              />
            </TabPanel>

            <TabPanel>
              <ConnectionsView connections={value.connections} />
            </TabPanel>
            <TabPanel>
              <ApplicationEvents maxEvents={100} appID={value.app._id} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ContentSection>
    );
  }

  return (
    <>
      <Breadcrumb>
        <NavLink to="/applications">{t('applications')}</NavLink>
        <span>{name}</span>
      </Breadcrumb>

      <TextHeader title={name} subtitle={isLoading ? 0 : value.app.name} />
      {error ? <ErrorView error={error} /> : undefined}
      {content}
    </>
  );
}

export default observer(ViewApplication);
