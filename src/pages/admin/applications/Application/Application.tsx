import { useCallback, useEffect } from 'react';
import { Breadcrumb } from '@ui/Breadcrumb';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import ErrorView from '@ui/Error';
import LoadingSpinner from '@ui/LoadingSpinner';
import PageHeader from '@ui/PageHeader';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@ui/tabs';
import ApplicationEvents from './ApplicationEvents';
import ApplicationInfo from './ApplicationInfo';
import ApplicationSequences from './ApplicationSequences';
import DeleteApplicationModal from './DeleteApplicationModal';
import EditApplication from './EditApplication';
import { mdiCancel, mdiContentSave, mdiPencil, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { rest } from 'api/definition';
import { useApi } from 'hooks';
import useModal from 'hooks/useModal';
import ConnectionsView from 'pages/admin/applications/ConnectionsView';
import ApplicationTasks from 'pages/admin/applications/TasksView/TasksView';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';

function Application() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [search, setSearch] = useSearchParams();
  const isEditing = search.get('edit') === '1';
  const { applications } = useApi();

  const queryClient = useQueryClient();
  const {
    data: value,
    error,
    status,
  } = useQuery(['application', id], () => applications.get(id), {
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });
  const { reset, control, getValues } = useForm<rest.UpdateApplication>();

  const save = useMutation(
    async () => {
      await applications.update(value.app._id, getValues());
    },
    {
      onMutate: () => setSearch({ edit: '' }),
    }
  );

  useEffect(() => {
    if (!value) return;
    const { app } = value;
    reset({
      description: app.description,
      disabled: app.disabled,
      display_name: app.display_name,
      tags: app.tags,
    });
  }, [value]);

  const onTaskDeleted = useCallback(
    (taskID: string) => {
      queryClient.setQueryData<rest.ApplicationResponse>(['application', id], (response) => ({
        ...response,
        tasks: response.tasks.filter((task) => task._id !== taskID),
      }));
      queryClient.invalidateQueries(['application', id]);
    },
    [value]
  );

  const onTaskAdded = useCallback(
    (task: rest.TaskStandalone) => {
      // do optimistic update for now
      queryClient.setQueryData<rest.ApplicationResponse>(['application', id], (response) => ({
        ...response,
        tasks: [
          ...response.tasks,
          {
            ...task,
            app_id: task.app._id,
          },
        ],
      }));
      queryClient.invalidateQueries(['application', id]);
    },
    [value]
  );

  const appName = value ? value.app.display_name || value.app.name : id;
  const altName = value ? value.app.name : '';

  let content: React.ReactNode;

  if (status === 'error') {
    content = <ErrorView error={error} />;
  } else if (status === 'loading') {
    content = <LoadingSpinner size={2} />;
  } else if (isEditing) {
    content = (
      <ContentSection padded>
        <EditApplication control={control} />
      </ContentSection>
    );
  } else {
    content = (
      <TabPanels>
        <TabPanel>
          <ContentSection header={t('generalInformation')} padded>
            <ApplicationInfo app={value.app} />
          </ContentSection>
        </TabPanel>

        <TabPanel>
          <ContentSection>
            <ApplicationTasks
              appID={id}
              tasks={value.tasks}
              onTaskDeleted={onTaskDeleted}
              onTaskAdded={onTaskAdded}
            />
          </ContentSection>
        </TabPanel>

        <TabPanel>
          <ContentSection>
            <ConnectionsView connections={value.connections} />
          </ContentSection>
        </TabPanel>
        <TabPanel>
          <ContentSection>
            <ApplicationEvents appID={value.app._id} />
          </ContentSection>
        </TabPanel>
        <TabPanel>
          <ContentSection padded>
            <ApplicationSequences appID={value.app._id} />
          </ContentSection>
        </TabPanel>
      </TabPanels>
    );
  }

  let actions: React.ReactNode;

  const openModal = useModal();
  const openDeleteModal = useCallback(() => {
    openModal(({ onClose }) => (
      <DeleteApplicationModal onClose={onClose} appID={value.app._id} appName={appName} />
    ));
  }, [value]);

  if (value) {
    actions = isEditing ? (
      <ButtonGroup>
        <Button
          onClick={() => save.mutate()}
          loading={save.isLoading}
          disabled={save.isLoading}
          left={<Icon size={1} path={mdiContentSave} />}
          color="success"
        >
          {t('save')}
        </Button>
        <Button onClick={() => setSearch({ edit: '' })} left={<Icon size={1} path={mdiCancel} />}>
          {t('cancel')}
        </Button>{' '}
      </ButtonGroup>
    ) : (
      <ButtonGroup>
        <Button to="?edit=1" left={<Icon size={1} path={mdiPencil} />} color="primary">
          {t('edit')}
        </Button>
        <Button
          onClick={openDeleteModal}
          left={<Icon size={1} path={mdiTrashCan} />}
          color="danger"
        >
          {t('delete')}
        </Button>
      </ButtonGroup>
    );
  }

  return (
    <Tabs id="d" hidden={isEditing}>
      <PageHeader
        top={
          <Breadcrumb>
            <NavLink to="/admin/applications">{t('applications')}</NavLink>
            <span>{appName}</span>
          </Breadcrumb>
        }
        backAction="/admin/applications"
        title={appName}
        subtitle={altName}
        bottom={
          status !== 'success' ? undefined : (
            <TabList>
              <Tab>{t('general')}</Tab>
              <Tab>{t('tasks')}</Tab>
              <Tab>{t('connections')}</Tab>
              <Tab>{t('events')}</Tab>
              <Tab>{t('sequences')}</Tab>
            </TabList>
          )
        }
        actions={actions}
      />

      <Container padded>{content}</Container>
    </Tabs>
  );
}

export default Application;
