import DescriptiveItem from '@ui/DescriptiveItem';
import { Select } from '@ui/Input';
import { DEFAULT_TASK_BODY } from 'api/definition';
import { useTranslation } from 'react-i18next';

function TaskType({ type }: { type: string }) {
  const { t } = useTranslation();
  return <DescriptiveItem value={type} description={t(`taskTypeX.${type}`)} />;
}

interface TaskTypeSelectProps {
  selected: string;
  onChange: (type: string) => void;
}

function renderType(type: string) {
  return <TaskType type={type} />;
}

export default function TaskTypeSelect({ onChange, selected }: TaskTypeSelectProps) {
  return (
    <Select<string>
      onChange={onChange}
      value={selected}
      options={Object.keys(DEFAULT_TASK_BODY)}
      keyFactory={(v) => v}
      renderElement={renderType}
    />
  );
}
