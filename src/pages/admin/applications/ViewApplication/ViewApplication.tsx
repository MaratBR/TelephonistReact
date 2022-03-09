import { useCallback, useEffect, useState } from 'react';
import { Breadcrumb } from '@coreui/Breadcrumb';
import { Button } from '@coreui/Button';
import ButtonGroup from '@coreui/ButtonGroup';
import Container from '@coreui/Container';
import ContentSection from '@coreui/ContentSection';
import ErrorView from '@coreui/Error';
import LoadingSpinner from '@coreui/LoadingSpinner';
import PageHeader from '@coreui/PageHeader';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@coreui/tabs';
import ApplicationEvents from './ApplicationEvents';
import EditApplication from './EditApplication';
import ViewApplicationInfo from './ViewApplicationInfo';
import { mdiCancel, mdiContentSave, mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { TaskStandalone, UpdateApplication } from 'api/definition';
import { useApi } from 'api/hooks';
import { useRefreshableAsyncValue } from 'core/hooks';
import { observer } from 'mobx-react';
import ConnectionsView from 'pages/admin/applications/ConnectionsView';
import ApplicationTasks from 'pages/admin/applications/TasksView/TasksView';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';

function ViewApplication() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [search] = useSearchParams();
  const isEditing = search.get('edit') === '1';
  const { applications } = useApi();
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState();
  const {
    value,
    isLoading,
    error: fetchError,
    setValue,
    refresh,
  } = useRefreshableAsyncValue(() => applications.get(id), [id]);
  const { reset, control, getValues } = useForm<UpdateApplication>();

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

  const save = useCallback(async () => {
    if (!value) return;
    setSaving(true);
    try {
      const app = await applications.update(value.app._id, getValues());
      reset(app);
      toast.success(t('saved'));
      setError(undefined);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  }, [getValues, value]);

  const appName = value ? value.app.display_name : id;
  const altName = value ? value.app.name : '';

  let content: React.ReactNode;

  if (fetchError) {
    content = <ErrorView error={fetchError} />;
  } else if (isLoading) {
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
          <ContentSection padded>
            <ViewApplicationInfo app={value.app} />
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
            <ApplicationEvents maxEvents={100} appID={value.app._id} />
          </ContentSection>
        </TabPanel>
      </TabPanels>
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
          isLoading ? undefined : (
            <TabList>
              <Tab>{t('general')}</Tab>
              <Tab>{t('tasks')}</Tab>
              <Tab>{t('connections')}</Tab>
              <Tab>{t('events')}</Tab>
            </TabList>
          )
        }
        actions={
          isEditing ? (
            <ButtonGroup>
              <Button
                onClick={save}
                loading={isSaving}
                disabled={isSaving}
                left={<Icon size={1} path={mdiContentSave} />}
                color="success"
              >
                {t('save')}
              </Button>
              <Button to="?" left={<Icon size={1} path={mdiCancel} />}>
                {t('cancel')}
              </Button>{' '}
            </ButtonGroup>
          ) : (
            <Button to="?edit=1" left={<Icon size={1} path={mdiPencil} />} color="primary">
              {t('edit')}
            </Button>
          )
        }
      />

      <Container>
        {error ? <ErrorView error={error} /> : undefined}
        {content}
      </Container>
    </Tabs>
  );
}

export default observer(ViewApplication);
