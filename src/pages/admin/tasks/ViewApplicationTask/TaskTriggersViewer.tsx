import { useMemo } from 'react';
import { DataGrid } from '@coreui/DataGrid';
import TriggerBodyView from './TriggerBodyView';
import { TaskTrigger } from 'api/definition';
import { MD5 } from 'object-hash';
import { useTranslation } from 'react-i18next';
import { Shruggie } from 'ui/misc';

export default function TaskTriggersViewer({ triggers }: { triggers: TaskTrigger[] }) {
  const { t } = useTranslation();
  const shruggie = useMemo(
    () => (
      <Shruggie>
        <p>{t('noTaskTriggersDefined')}</p>
      </Shruggie>
    ),
    [t]
  );

  return (
    <DataGrid<TaskTrigger>
      noItemsRenderer={() => shruggie}
      keyFactory={MD5}
      data={triggers}
      columns={[
        {
          title: t('triggerType'),
          key: 'name',
        },
        {
          title: t('triggerBody'),
          key: '_body',
          custom: true,
          render: ({ body, name }) => <TriggerBodyView body={body} triggerType={name} />,
        },
      ]}
    />
  );
}
