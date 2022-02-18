import { useEffect, useState } from 'react';
import { Breadcrumb } from '@ui/Breadcrumb';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import { Card } from '@ui/Card';
import { DataGrid, DataGridColumn, renderBoolean, renderObjectID } from '@ui/DataGrid';
import { Heading } from '@ui/Text';
import { mdiPencil, mdiPlus, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { Application, Pagination } from 'api/definition';
import { useApi } from 'api/hooks';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export default function AllApplications() {
  const [pagination, setPagination] = useState<Pagination<Application>>();
  const api = useApi();

  useEffect(() => {
    api.getApplictions({}).then(setPagination);
  }, []);

  const { t } = useTranslation();

  const columns: DataGridColumn<Application>[] = [
    {
      key: '_id',
      title: 'ID',
      render: (id) => <NavLink to={`/applications/${id}`}>{renderObjectID(id)}</NavLink>,
    },
    { key: 'name', title: t('name') },
    { key: 'disabled', title: t('disabled'), render: renderBoolean },
    { key: 'description', title: t('description') },
    {
      custom: true,
      render: () => (
        <span>
          <Button size="sm" left={<Icon size={1} path={mdiPencil} />}>
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
          <Button color="primary" to="/applications/new" left={<Icon size={1} path={mdiPlus} />}>
            {t('createNew')}
          </Button>
          <Button disabled color="danger" left={<Icon size={1} path={mdiTrashCan} />}>
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
