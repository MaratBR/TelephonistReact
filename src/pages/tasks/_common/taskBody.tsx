import { useCallback, useState } from 'react';
import { CodeEditor, CodeViewer } from '@coreui/Editor';
import Error from '@coreui/Error';
import { TASK_ARBITRARY } from 'api/definition';

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
  body: any;
  type: string;
  onChange: (value: any) => void;
}

export function TaskBodyEditor({ type, body, onChange }: TaskBodyEditorProps) {
  const [error, setError] = useState();
  const onUpdate = useCallback(
    (s: string) => {
      try {
        onChange(stringToTaskBody(s, type));
        if (error) setError(undefined);
      } catch (e) {
        setError(e);
      }
    },
    [onChange, type, error]
  );
  return (
    <div>
      <Error error={error} />
      <CodeEditor value={body} onChange={onUpdate} lang={getLanguage(type)} />
    </div>
  );
}

interface TaskBodyViewerProps {
  type: string;
  body: any;
}

export function TaskBodyViewer({ type, body }: TaskBodyViewerProps) {
  const lang = getLanguage(type);
  return <CodeViewer lang={lang} code={taskBodyToString(body, type)} />;
}
