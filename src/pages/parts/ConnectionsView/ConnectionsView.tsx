import {
  DataGrid,
  dateRender,
  renderBoolean,
  renderObjectID,
} from '@ui/DataGrid';
import { Shruggie } from '../misc';
import { ConnectionInfo } from 'api/definition';
import { useTranslation } from 'react-i18next';

type ConnectionsViewProps = {
  connections: ConnectionInfo[];
};

function ConnectionsView({ connections }: ConnectionsViewProps) {
  const { t } = useTranslation();
  const noItemsShruggie = (
    <Shruggie>
      <p>{t('noOpenConnections')}</p>
    </Shruggie>
  );
  return (
    <DataGrid
      noItemsRenderer={() => noItemsShruggie}
      keyFactory={(app) => app._id}
      columns={[
        {
          title: t('id'),
          key: '_id',
          render: renderObjectID,
        },
        {
          title: t('is_connected'),
          key: 'is_connected',
          render: renderBoolean,
        },
        {
          title: t('client_name'),
          key: 'client_name',
        },
        {
          key: 'connected_at',
          title: t('connected_at'),
          render: dateRender,
        },
      ]}
      data={connections}
    />
  );
}

export default ConnectionsView;
