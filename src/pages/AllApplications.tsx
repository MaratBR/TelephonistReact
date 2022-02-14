import { Breadcrumb } from '@cc/Breadcrumb';
import { Button } from '@cc/Button';
import ButtonGroup from '@cc/ButtonGroup';
import { Card } from '@cc/Card';
import {
  DataGrid,
  DataGridColumn,
  renderBoolean,
  renderObjectID,
} from '@cc/DataGrid';
import { Heading } from '@cc/Text';
import { mdiPencil, mdiPlus, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import api, { models } from 'api';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export default function AllApplications() {
  const [pagination, setPagination] =
    useState<models.Pagination<models.ApplicationView>>();

  useEffect(() => {
    api.getApplictions({}).then(setPagination);
  }, []);

  const { t } = useTranslation();

  const columns: DataGridColumn<models.ApplicationView>[] = [
    {
      key: '_id',
      title: 'ID',
      render: (id) => (
        <NavLink to={`/applications/${id}`}>{renderObjectID(id)}</NavLink>
      ),
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
          <Button
            color="primary"
            to="/applications/new"
            left={<Icon size={1} path={mdiPlus} />}
          >
            {t('create_new')}
          </Button>
          <Button
            disabled
            color="danger"
            left={<Icon size={1} path={mdiTrashCan} />}
          >
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
