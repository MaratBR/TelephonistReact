import { useCallback, useEffect, useState } from 'react';
import { Breadcrumb } from '@coreui/Breadcrumb';
import { Button } from '@coreui/Button';
import ButtonGroup from '@coreui/ButtonGroup';
import Container from '@coreui/Container';
import ContentSection from '@coreui/ContentSection';
import Error from '@coreui/Error';
import PageHeader from '@coreui/PageHeader';
import { Parameters } from '@coreui/Parameters';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@coreui/tabs';
import { TaskBodyViewer } from '../_common/TaskBodyEditor';
import TaskEditor from './TaskEditor';
import TaskTriggers from './TaskTriggersEditor';
import TaskTriggersViewer from './TaskTriggersViewer';
import { mdiCancel, mdiContentSave } from '@mdi/js';
import Icon from '@mdi/react';
import { UpdateTask } from 'api/definition';
import { useApi } from 'api/hooks';
import { useRefreshableAsyncValue } from 'core/hooks';
import ContentLoader from 'react-content-loader';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function ViewApplicationTask() {
  const { t } = useTranslation();
  const api = useApi();
  const { appName, taskName } = useParams();
  const [search] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const isEditing = search.get('edit') === '1';
  const navigate = useNavigate();

  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState();
  const {
    value,
    setValue,
    error: fetchError,
  } = useRefreshableAsyncValue(() => api.tasks.getByName(appName, taskName));

  const { control, getValues, reset } = useForm<UpdateTask>({
    defaultValues: { description: 'qweqweqw' },
  });

  const save = useCallback(async () => {
    if (isSaving) return;
    setSaving(true);
    try {
      const newTask = await api.tasks.update(value._id, getValues());
      logging.warn('saved new triggers, setValue(...)', newTask);
      reset(newTask);
      setValue(newTask);
      navigate('?');
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  }, [isSaving, getValues, value]);

  useEffect(() => {
    setLoading(true);
    api.tasks
      .getByName(appName, taskName)
      .then(reset)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [appName, taskName]);

  const breadcrumb = (
    <Breadcrumb>
      <NavLink to="/admin/applications">{t('applications')}</NavLink>
      <NavLink to={`/admin/applications/${appName}`}>{appName}</NavLink>
      <span>{taskName}</span>
    </Breadcrumb>
  );

  if (loading) {
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
          <Error error={fetchError} />
        </Container>
      </>
    );
  }

  let content: React.ReactNode;

  if (isEditing) {
    content = (
      <>
        <Error error={error} />
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
          <Error error={error} />
          <ContentSection padded header={t('generalInformation')}>
            <Parameters
              parameters={{
                [t('description')]: value.description,
                [t('taskBody')]: <TaskBodyViewer body={value.body} />,
                [t('taskType')]: value.body.type,
              }}
            />
          </ContentSection>
          <ContentSection padded header={t('triggers')}>
            <TaskTriggersViewer triggers={value?.triggers ?? []} />
          </ContentSection>
        </TabPanel>

        <TabPanel tabID="events">Events</TabPanel>
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
            <Tab tabID="events">{t('events')}</Tab>
          </TabList>
        }
        actions={
          <ButtonGroup>
            {isEditing ? (
              [
                <Button
                  loading={isSaving}
                  disabled={isSaving}
                  onClick={save}
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
              <Button color="primary" to="?edit=1">
                {t('edit')}
              </Button>
            )}
          </ButtonGroup>
        }
        backAction={`/admin/applications/${appName}`}
        subtitle={value._id}
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
