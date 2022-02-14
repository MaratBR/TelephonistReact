import ContentSection from '@cc/ContentSection';
import {
  DataGrid, dateRender, renderBoolean, renderObjectID,
} from '@cc/DataGrid';
import ErrorView from '@cc/Error';
import { Centered } from '@cc/Layout';
import LoadingSpinner from '@cc/LoadingSpinner';
import {
  Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@cc/tabs';
import { TextHeader } from '@cc/Text';
import { TaskStandalone } from 'api/definition';

import { useApi, useEventPagination } from 'api/hooks';
import { Breadcrumb } from 'core/components/Breadcrumb';
import { useRefreshableAsyncValue } from 'core/hooks';
import { observer } from 'mobx-react';
import ConnectionsView from 'pages/parts/ConnectionsView';
import EventsViewer from 'pages/parts/EventsViewer';
import ApplicationTasks from 'pages/parts/TasksView/TasksView';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';
import ViewApplicationInfo from './ViewApplicationInfo';

interface ApplicationEventsProps {
  id: string;
}

const ApplicationEvents = observer(({ id }: ApplicationEventsProps) => {
  const events = useEventPagination({ app_id: id });
  return <EventsViewer events={events.value?.result ?? []} />;
});

function ViewApplication() {
  const { id } = useParams();
  const api = useApi();
  const {
    value, isLoading, error, setValue,
  } = useRefreshableAsyncValue(() => api.getAppliction(id), [id]);
  const name = isLoading ? id : value.app.display_name;
  const { t } = useTranslation();

  const onTaskAdded = useCallback((task: TaskStandalone) => {
    // do optimistic update for now
    setValue({
      ...value,
      tasks: [
        ...value.tasks,
        {
          ...task,
          app_id: task.app._id,
        },
      ],
    });
  }, [value]);

  let content: React.ReactNode;

  if (isLoading) {
    content = <LoadingSpinner size={2} />;
  } else {
    content = (
      <ContentSection header={t("information")}>
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
                onTaskAdded={onTaskAdded}
              />
            </TabPanel>

            <TabPanel>
              <ConnectionsView connections={value.connections} />
            </TabPanel>
            <TabPanel>
              <ApplicationEvents id={id} />
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

      <TextHeader
        title={name}
        subtitle={isLoading ? 0 : value.app.name}
      />
      {
        error ? <ErrorView error={error} /> : undefined
      }
      {content}
    </>
  );
}

export default observer(ViewApplication);
