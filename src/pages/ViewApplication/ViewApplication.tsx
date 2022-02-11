import { Card } from '@cc/Card';
import { ContentBox } from '@cc/ContentBox';
import {
  DataGrid, dateRender, renderBoolean, renderObjectID,
} from '@cc/DataGrid';
import ErrorView from '@cc/Error';
import { Centered } from '@cc/Layout';
import LoadingSpinner from '@cc/LoadingSpinner';
import {
  Tab, TabList, TabPanel, Tabs,
} from '@cc/tabs';
import { TextHeader } from '@cc/Text';
import { models } from 'api';
import { useApi, useEventPagination } from 'api/hooks';
import { Breadcrumb } from 'core/components/Breadcrumb';
import { Stack } from 'core/components/Stack';
import { useAsyncValue } from 'core/hooks';
import { observer } from 'mobx-react';
import EventsViewer from 'pages/parts/EventsViewer';
import ApplicationTasks from 'pages/parts/TasksView/TasksView';
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

function ApplicationResponseView({
  response,
}: {
  response: models.ApplicationResponse;
}) {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <Tabs tabsID="1">
      <TabList>
        <Tab>{t('information')}</Tab>
        <Tab>{t('tasks')}</Tab>
        <Tab>{t('connections')}</Tab>
        <Tab>{t('events')}</Tab>
      </TabList>

      <TabPanel>
        <ViewApplicationInfo app={response.app} />
      </TabPanel>

      <TabPanel>
        <ApplicationTasks appID={id} />
      </TabPanel>

      <TabPanel>
        {response.connections ? (
          <DataGrid
            keyFactory={(app) => app._id}
            columns={[
              {
                title: t('id'),
                key: '_id',
                render: renderObjectID,
              },
              {
                title: t('is_connected'),
                key: 'is_connected',
                render: renderBoolean,
              },
              {
                title: t('client_name'),
                key: 'client_name',
              },
              {
                key: 'connected_at',
                title: t('connected_at'),
                render: dateRender,
              },
            ]}
            data={response.connections}
          />
        ) : (
          <Centered>{t('no_connections_open')}</Centered>
        )}
      </TabPanel>
      <TabPanel>
        <ApplicationEvents id={id} />
      </TabPanel>
    </Tabs>
  );
}

function ViewApplication() {
  const { id } = useParams();
  const api = useApi();
  const { value, isLoading, error } = useAsyncValue(() => api.getAppliction(id), [id]);
  const name = isLoading ? id : value.app.display_name;
  const { t } = useTranslation();

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
      <ContentBox>
        {
          error ? <ErrorView error={error} /> : undefined
        }
        {
          isLoading
            ? <LoadingSpinner size={2} />
            : <ApplicationResponseView response={value} />
        }
      </ContentBox>
    </>
  );
}

export default observer(ViewApplication);
