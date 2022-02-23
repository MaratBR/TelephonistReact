import { Breadcrumb } from '@coreui/Breadcrumb';
import LoadingSpinner from '@coreui/LoadingSpinner';
import { TextHeader } from '@coreui/Text';
import EditApplication from './EditApplication';
import { useApi } from 'api/hooks';
import { useRefreshableAsyncValue } from 'core/hooks';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

export default function EditApplicationPage() {
  const api = useApi();
  const { id } = useParams();
  const { value, error, isLoading, setValue } = useRefreshableAsyncValue(() =>
    api.applications.get(id)
  );
  const { t } = useTranslation();

  const displayName = isLoading ? id : value.app.display_name;
  const applicationName = isLoading ? '' : value.app.name;

  let content;

  if (isLoading) {
    content = <LoadingSpinner />;
  } else {
    content = (
      <EditApplication
        onUpdated={(app) => setValue((oldValue) => ({ ...oldValue, app }))}
        app={value.app}
      />
    );
  }

  return (
    <>
      <Breadcrumb>
        <NavLink to="/applications">{t('applications')}</NavLink>
        <NavLink to={`/applications/${isLoading ? id : value.app.name}`}>{applicationName}</NavLink>
        <span>{t('edit')}</span>
      </Breadcrumb>
      <TextHeader title={displayName} subtitle={applicationName} />
      {content}
    </>
  );
}
