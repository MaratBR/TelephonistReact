import { Parameters } from '@coreui/Parameters';
import { TaskBodyViewer } from '../_common/taskBody';
import { TaskStandalone } from 'api/definition';
import { useTranslation } from 'react-i18next';

interface TaskViewProps {
  task: TaskStandalone;
}

export default function TaskView({ task }: TaskViewProps) {
  const { t } = useTranslation();
  return (
    <Parameters
      parameters={{
        [t('description')]: task.description,
        [t('taskBody')]: <TaskBodyViewer body={task.body} type={task.task_type} />,
      }}
    />
  );
}
