import { useState } from 'react';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import { DataGrid, renderBoolean } from '@ui/DataGrid';
import { Select } from '@ui/Input';
import PageHeader from '@ui/PageHeader';
import { Stack } from '@ui/Stack';
import { rest } from 'api/definition';
import PaginationLayout from 'components/ui/PaginationLayout';
import { useApi } from 'hooks';
import { usePageParam } from 'hooks/useSearchParam';
import Padded from 'pages/Padded';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from 'store';

export default function UsersList() {
  const [page, setPage] = usePageParam();
  const { users } = useApi();

  // TODO: complete this
  const isSuperuser = useAppSelector((s) => s.auth.user.is_superuser);
  const { t } = useTranslation();
  const [order, setOrder] = useState<'_id' | 'username'>('_id');
  const { data: pagination, isFetching } = useQuery(
    ['users', order, page],
    () => users.getUsers({ page, order_by: order, order: order === 'username' ? 'asc' : 'desc' }),
    { keepPreviousData: true, retry: 3 }
  );

  return (
    <>
      <PageHeader title={t('users.all')} />
      <Container>
        <Padded>
          <Stack h>
            <Select<'_id' | 'username'>
              keyFactory={(v) => v}
              onChange={setOrder}
              value={order}
              options={['_id', 'username']}
              renderElement={(field) => (field === '_id' ? t('order.new2Old') : t('username'))}
            />
          </Stack>
        </Padded>
        <ContentSection padded>
          <PaginationLayout
            loading={isFetching}
            totalPages={pagination?.pages_total ?? page}
            onSelect={setPage}
            selectedPage={page}
          >
            <DataGrid<rest.User>
              data={pagination?.result}
              keyFactory={(u) => u._id}
              columns={[
                {
                  key: '_id',
                  title: t('id'),
                },
                {
                  key: 'username',
                  title: t('username'),
                  render: (v) => <NavLink to={`/admin/users/${v}`}>{v}</NavLink>,
                },
                {
                  key: 'is_blocked',
                  title: t('user.isBlocked'),
                  render: renderBoolean,
                },
                {
                  key: 'is_superuser',
                  title: t('user.isSuperuser'),
                  render: renderBoolean,
                },
                {
                  key: '__isDeleted',
                  custom: true,
                  title: t('user.isDeleted'),
                  render: ({ will_be_deleted_at }) => renderBoolean(!!will_be_deleted_at),
                },
              ]}
            />
          </PaginationLayout>
        </ContentSection>
      </Container>
    </>
  );
}
