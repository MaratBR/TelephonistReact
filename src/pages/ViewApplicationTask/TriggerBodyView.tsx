import { Input } from "@cc/Input";
import { TRIGGER_CRON, TRIGGER_EVENT, TRIGGER_FSNOTIFY } from "api/definition";

import { useTranslation } from "react-i18next";

type TriggerBodyViewProps = {
  body: any;
  triggerType: string;
  onChange?: (value: any) => void;
  editable?: boolean;
}

function isTextBody(triggerType: string): boolean {
  return [TRIGGER_CRON, TRIGGER_EVENT, TRIGGER_FSNOTIFY].includes(triggerType);
}

function TriggerBodyView({
  editable, triggerType, body, onChange,
}: TriggerBodyViewProps) {
  const { t } = useTranslation();
  const bodyTranslation = t("triggerBody");

  if (isTextBody(triggerType)) {
    return (
      <Input
        value={body}
        readOnly={!editable}
        onChange={(e) => { if (onChange) onChange(e.target.value); }}
        placeholder={bodyTranslation}
      />
    );
  }

  return null;
}

export default TriggerBodyView;
