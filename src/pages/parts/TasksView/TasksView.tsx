import { mdiExclamationThick } from '@mdi/js';
import Icon from '@mdi/react';
import api from 'api';
import { DataGrid, renderBoolean } from 'core/components/DataGrid';
import ErrorView from 'core/components/Error';
import LoadingSpinner from 'core/components/LoadingSpinner';
import { useAsyncValue } from 'core/hooks';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import S from './TasksView.module.scss';

type ApplicationTasksProps = {
  appID: string;
};

export default function ApplicationTasks({ appID }: ApplicationTasksProps) {
  const {
    isLoading, error, value,
  } = useAsyncValue(
    () => api.getApplicationTasks(appID),
    [appID],
  );
  const { t } = useTranslation();

  let content;

  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (error) {
    content = <ErrorView error={error} />;
  } else {
    content = (
      <DataGrid
        keyFactory={(v) => v._id}
        data={value}
        columns={[
          {
            key: '__id',
            custom: true,
            title: t('task'),
            render: (v) => {
              const [appName, taskName] = v.qualified_name.split('/');
              return (
                <div className={S.name}>
                  <NavLink to={`/applications/${appID}/tasks/${v._id}`}>
                    <h2>
                      <span>{appName}</span>
                      /
                      <span>{taskName}</span>
                    </h2>
                  </NavLink>
                  <code>{v._id}</code>
                </div>
              );
            },
          },
          {
            key: 'disabled',
            title: t('disabled'),
            render: renderBoolean,
          },
          {
            title: t('task_type'),
            key: 'task_type',
          },
          {
            title: '',
            key: '__misc',
            custom: true,
            render: (v) => {
              if (v.errors !== {}) {
                return <Icon path={mdiExclamationThick} size={1} />;
              }
              return '';
            },
          },
        ]}
      />
    );
  }

  return <div>{content}</div>;
}
