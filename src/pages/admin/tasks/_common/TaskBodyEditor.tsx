import { useState } from 'react';
import { CodeEditor, CodeViewer } from '@coreui/Editor';
import S from './TaskBodyEditor.module.scss';
import TaskTypeSelect from './TaskTypeSelect';
import { DEFAULT_TASK_BODY, TASK_ARBITRARY, TaskBody } from 'api/definition';

function taskBodyToString(body: any, type: string): string {
  if (type === TASK_ARBITRARY) return JSON.stringify(body, null, 2);
  if (typeof body !== 'string') return `INVALID BODY TYPE: ${typeof body}`;
  return body;
}

function stringToTaskBody(s: string, type: string): any {
  if (type === TASK_ARBITRARY) return JSON.parse(s);
  return s;
}

function getLanguage(type: string) {
  if (type === TASK_ARBITRARY) {
    return 'json';
  }
  return 'shell';
}

interface TaskBodyEditorProps {
  value?: TaskBody;
  onChange: (value: TaskBody) => void;
}

export function TaskBodyEditor({ value, onChange }: TaskBodyEditorProps) {
  const [error, setError] = useState();
  const [text, setText] = useState(taskBodyToString(value.value, value.type));

  const onValueChanged = (s: string) => {
    setText(s);
    if (!value) return;
    try {
      onChange({
        ...value,
        value: stringToTaskBody(s, value.type),
      });
      setError(undefined);
    } catch (e) {
      setError(e.toString());
    }
  };
  const onTypeChange = (newType: string) => {
    if (!value) return;
    const newValue = {
      value: DEFAULT_TASK_BODY[newType](),
      type: newType,
    };
    onChange(newValue);
  };

  return (
    <div className={S.editor}>
      <TaskTypeSelect selected={value?.type} onChange={onTypeChange} />
      <CodeEditor
        error={error}
        value={text}
        onChange={onValueChanged}
        lang={value ? getLanguage(value.type) : undefined}
      />
    </div>
  );
}

interface TaskBodyViewerProps {
  body: TaskBody;
}

export function TaskBodyViewer({ body }: TaskBodyViewerProps) {
  const lang = getLanguage(body.type);
  return <CodeViewer lang={lang} code={taskBodyToString(body.value, body.type)} />;
}
