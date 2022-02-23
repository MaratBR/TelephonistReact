import { useEffect, useState } from 'react';
import { Breadcrumb } from '@coreui/Breadcrumb';
import { Button } from '@coreui/Button';
import ButtonGroup from '@coreui/ButtonGroup';
import { Card } from '@coreui/Card';
import { DataGrid, DataGridColumn, renderBoolean, renderObjectID } from '@coreui/DataGrid';
import { Heading } from '@coreui/Text';
import { mdiPencil, mdiPlus, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { Application, Pagination } from 'api/definition';
import { useApi } from 'api/hooks';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export default function AllApplications() {
  const [pagination, setPagination] = useState<Pagination<Application>>();
  const { applications: applicationsApi } = useApi();

  useEffect(() => {
    applicationsApi.getAll({}).then(setPagination);
  }, []);

  const { t } = useTranslation();

  const columns: DataGridColumn<Application>[] = [
    {
      key: '_id',
      title: 'ID',
      render: renderObjectID,
    },
    {
      key: 'name',
      title: t('name'),
      render: (name) => <NavLink to={`/applications/${name}`}>{name}</NavLink>,
    },
    { key: 'disabled', title: t('disabled'), render: renderBoolean },
    { key: 'description', title: t('description') },
    {
      custom: true,
      render: () => (
        <span>
          <Button size="sm" left={<Icon size={0.9} path={mdiPencil} />}>
            {t('edit')}
          </Button>
        </span>
      ),
      key: 'buttons',
      title: '',
    },
  ];

  return (
    <div>
      <Breadcrumb>
        <span>{t('applications')}</span>
        <span>{t('allApps')}</span>
      </Breadcrumb>
      <Heading>{t('allApps')}</Heading>

      <Card>
        <ButtonGroup>
          <Button color="primary" to="/applications/new" left={<Icon size={0.9} path={mdiPlus} />}>
            {t('createNew')}
          </Button>
          <Button disabled color="danger" left={<Icon size={0.9} path={mdiTrashCan} />}>
            {t('delete')}
          </Button>
        </ButtonGroup>

        <DataGrid
          keyFactory={(a) => a._id}
          selectable
          data={pagination?.result ?? []}
          columns={columns}
        />
      </Card>
    </div>
  );
}
