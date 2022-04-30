import { Breadcrumb } from '@ui/Breadcrumb';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import { DataGrid, DataGridColumn, renderBoolean, renderObjectID } from '@ui/DataGrid';
import ErrorView from '@ui/Error';
import PageHeader from '@ui/PageHeader';
import { mdiPencil, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { Application } from 'api/definition';
import PaginationLayout from 'components/ui/PaginationLayout';
import { useApi } from 'hooks';
import { usePageParam } from 'hooks/useSearchParam';
import Padded from 'pages/Padded';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { ellipsizeFn } from 'utils';

export default function AllApplications() {
  const [page, setPage] = usePageParam();
  const { applications: api } = useApi();

  const {
    data: pagination,
    error,
    isFetching,
  } = useQuery(['allApplications', page], () => api.getAll({ page }), { keepPreviousData: true });

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
      render: (name) => <NavLink to={`/admin/applications/${name}`}>{name}</NavLink>,
    },
    { key: 'disabled', title: t('disabled'), render: renderBoolean },
    {
      key: 'description',
      title: t('description'),
      render: ellipsizeFn(20),
    },
    {
      custom: true,
      render: ({ name }) => (
        <ButtonGroup>
          <Button
            to={`/admin/applications/${name}?edit=1`}
            size="sm"
            left={<Icon size={0.9} path={mdiPencil} />}
          >
            {t('edit')}
          </Button>
        </ButtonGroup>
      ),
      key: 'buttons',
      title: '',
    },
  ];

  return (
    <>
      <PageHeader
        top={
          <Breadcrumb>
            <span>{t('applications')}</span>
            <span>{t('allApps')}</span>
          </Breadcrumb>
        }
        title={t('allApps')}
      />
      <Container>
        <ContentSection>
          <Padded>
            <ButtonGroup>
              <Button
                color="primary"
                to="/admin/applications/new"
                left={<Icon size={0.9} path={mdiPlus} />}
              >
                {t('createNew')}
              </Button>
            </ButtonGroup>
          </Padded>

          <ErrorView error={error} />

          <PaginationLayout
            loading={isFetching}
            onSelect={setPage}
            selectedPage={page}
            totalPages={pagination?.pages_total}
          >
            <DataGrid
              keyFactory={(a) => a._id}
              selectable
              data={pagination ? pagination.result : []}
              columns={columns}
            />
          </PaginationLayout>
        </ContentSection>
      </Container>
    </>
  );
}
