import { useCallback, useEffect } from 'react';
import { Breadcrumb } from '@ui/Breadcrumb';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import ErrorView from '@ui/Error';
import { YesNoModal } from '@ui/Modal';
import PageHeader from '@ui/PageHeader';
import { Parameters } from '@ui/Parameters';
import { Text } from '@ui/Text';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@ui/tabs';
import { TaskBodyViewer } from '../_common/TaskBodyEditor';
import TaskEditor from './TaskEditor';
import TaskSequences from './TaskSequences';
import TaskTriggers from './TaskTriggersEditor';
import TaskTriggersViewer from './TaskTriggersViewer';
import { mdiCancel, mdiContentSave } from '@mdi/js';
import Icon from '@mdi/react';
import { UpdateTask } from 'api/definition';
import { useApi } from 'hooks';
import useModal from 'hooks/useModal';
import ContentLoader from 'react-content-loader';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function ViewApplicationTask() {
  const { t } = useTranslation();
  const { appName, taskName } = useParams();
  const { tasks } = useApi();

  const [search, setSearch] = useSearchParams();
  const {
    data: task,
    status,
    error: fetchError,
    refetch,
  } = useQuery(['task', appName, taskName], () => tasks.getByName(appName, taskName));
  const isEditing = search.get('edit') === '1';
  const { control, getValues, reset } = useForm<UpdateTask>();

  useEffect(() => {
    reset(task);
  }, [task]);

  const save = useMutation(
    async () => {
      await tasks.update(task._id, getValues());
    },
    {
      onSuccess: () => {
        setSearch({ edit: '' });
        refetch();
      },
    }
  );

  const navigate = useNavigate();
  const openDialog = useModal();
  const openDeleteDialog = useCallback(() => {
    if (!task) return;
    openDialog(({ onClose }) => (
      <YesNoModal
        onClose={onClose}
        onYes={async () => {
          await tasks.delete(task._id);
          navigate(`/admin/applications/${task.app.name}?t.0=tasks`);
        }}
      >
        <p>{t('deleteAppTaskWarn', { id: task._id })}</p>
      </YesNoModal>
    ));
  }, [task]);

  const breadcrumb = (
    <Breadcrumb>
      <NavLink to="/admin/applications">{t('applications')}</NavLink>
      <NavLink to={`/admin/applications/${appName}`}>{appName}</NavLink>
      <span>{taskName}</span>
    </Breadcrumb>
  );

  if (status === 'loading' || (isEditing && Object.keys(getValues()).length === 0)) {
    return (
      <>
        <PageHeader
          backAction={`/admin/applications/${appName}`}
          top={breadcrumb}
          title={`${appName}/${taskName}`}
          subtitle={t('loading')}
        />
        <Container>
          <ContentLoader />
        </Container>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <PageHeader
          backAction={`/admin/applications/${appName}`}
          top={breadcrumb}
          title={`${appName}/${taskName}`}
          subtitle={t('loading')}
        />
        <Container>
          <ErrorView error={fetchError} />
        </Container>
      </>
    );
  }

  let content: React.ReactNode;

  if (isEditing) {
    content = (
      <>
        <ErrorView error={save.error} />
        <ContentSection padded header={t('generalInformation')}>
          <TaskEditor control={control} />
        </ContentSection>
        <ContentSection padded header={t('triggers')}>
          <TaskTriggers control={control} />
        </ContentSection>
      </>
    );
  } else {
    content = (
      <TabPanels>
        <TabPanel>
          <ErrorView error={fetchError} />
          <ContentSection padded header={t('generalInformation')}>
            <Parameters
              parameters={{
                [t('description')]: task.description,
                [t('taskBody')]: <TaskBodyViewer body={task.body} />,
                [t('taskType')]: task.body.type,
              }}
            />
          </ContentSection>
          <ContentSection padded header={t('application')}>
            <h3>
              <NavLink to={`/admin/applications/${task.app.name}`}>
                {task.app.display_name} ({task.app.name})
              </NavLink>
            </h3>
            <Text type="hint">{task.app._id}</Text>
          </ContentSection>
          <ContentSection padded header={t('triggers')}>
            <TaskTriggersViewer triggers={task?.triggers ?? []} />
          </ContentSection>
        </TabPanel>

        <TabPanel tabID="sequences">
          <ContentSection padded>
            {task ? <TaskSequences taskID={task._id} /> : undefined}
          </ContentSection>
        </TabPanel>
      </TabPanels>
    );
  }

  const page = (
    <>
      <PageHeader
        top={breadcrumb}
        bottom={
          <TabList>
            <Tab>{t('generalInformation')}</Tab>
            <Tab tabID="sequences">{t('sequences')}</Tab>
          </TabList>
        }
        actions={
          <ButtonGroup>
            {isEditing ? (
              [
                <Button
                  loading={save.isLoading}
                  disabled={save.isLoading}
                  onClick={() => save.mutate()}
                  color="success"
                  left={<Icon path={mdiContentSave} size={0.9} />}
                  key={0}
                >
                  {t('save')}
                </Button>,
                <Button to="?" left={<Icon path={mdiCancel} size={0.9} />} key={1}>
                  {t('cancel')}
                </Button>,
              ]
            ) : (
              <>
                <Button color="primary" to="?edit=1">
                  {t('edit')}
                </Button>
                <Button color="danger" onClick={openDeleteDialog}>
                  {t('delete')}
                </Button>
              </>
            )}
          </ButtonGroup>
        }
        backAction={`/admin/applications/${appName}`}
        subtitle={task._id}
        title={`${appName}/${taskName}`}
      />

      <Container>{content}</Container>
    </>
  );
  return (
    <Tabs hidden={isEditing} id="0">
      {page}
    </Tabs>
  );
}
