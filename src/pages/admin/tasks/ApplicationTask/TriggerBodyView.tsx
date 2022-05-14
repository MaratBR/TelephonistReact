import { Input } from '@ui/Input';
import { rest } from 'api/definition';
import { useTranslation } from 'react-i18next';

type TriggerBodyViewProps = {
  body: any;
  triggerType: string;
  onChange?: (value: any) => void;
  editable?: boolean;
};

function isTextBody(triggerType: string): boolean {
  return [rest.TRIGGER_CRON, rest.TRIGGER_EVENT, rest.TRIGGER_FSNOTIFY].includes(triggerType);
}

function TriggerBodyView({ editable, triggerType, body, onChange }: TriggerBodyViewProps) {
  const { t } = useTranslation();
  const bodyTranslation = t('triggerBody');

  if (isTextBody(triggerType)) {
    if (editable) {
      return (
        <Input
          value={body}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
          }}
          placeholder={bodyTranslation}
        />
      );
    }
    return <pre>{body}</pre>;
  }

  return null;
}

export default TriggerBodyView;
