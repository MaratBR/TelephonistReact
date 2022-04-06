import { Breadcrumb } from '@ui/Breadcrumb';
import ErrorView from '@ui/Error';
import LoadingSpinner from '@ui/LoadingSpinner';
import { TextHeader } from '@ui/Text';
import EditApplication from './EditApplication';
import { UpdateApplication } from 'api/definition';
import { useApi } from 'hooks';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

export default function EditApplicationPage() {
  const api = useApi();
  const { id } = useParams();
  const { data, status, error } = useQuery(['application', id], () => api.applications.get(id));
  const { t } = useTranslation();
  const { control } = useForm<UpdateApplication>();

  const displayName = status === 'loading' ? id : data.app.display_name;
  const applicationName = status === 'loading' ? '' : data.app.name;

  let content;

  if (status === 'loading') {
    content = <LoadingSpinner />;
  } else if (status === 'error') {
    content = <ErrorView error={error} />;
  } else {
    content = <EditApplication control={control} />;
  }

  return (
    <>
      <Breadcrumb>
        <NavLink to="/admin/applications">{t('applications')}</NavLink>
        <NavLink to={`/admin/applications/${status === 'loading' ? id : data.app.name}`}>
          {applicationName}
        </NavLink>
        <span>{t('edit')}</span>
      </Breadcrumb>
      <TextHeader title={displayName} subtitle={applicationName} />
      {content}
    </>
  );
}
