import { Breadcrumb } from '@cc/Breadcrumb';
import ButtonGroup from '@cc/ButtonGroup';
import { Field } from '@cc/Field';
import { InputLayout } from '@cc/Input';
import { ModalDialog } from '@cc/Modal';
import { TaskTrigger, TRIGGER_EVENT } from 'api/definition';
import { useApi } from 'api/hooks';
import { ParametersStack } from 'pages/parts/Parameters';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TriggerBodyView from './TriggerBodyView';
import S from './TriggerPopupEditor.module.scss';

type TriggerPopupEditorProps = {
  trigger?: TaskTrigger;
  taskID: string;
  taskName: string;
  onClose?: () => void;
  appID: string;
};

function TriggerPopupEditor({
  taskName,
  taskID,
  trigger,
  onClose,
  appID,
}: TriggerPopupEditorProps) {
  const { t } = useTranslation();
  const api = useApi();
  const [body, setBody] = useState(trigger?.body ?? '');
  const [name, setName] = useState(trigger?.name ?? TRIGGER_EVENT);

  const save = () => {
    api.updateApplicationTask(appID, taskID, { name, body });
  };

  return (
    <ModalDialog
      header={
        <Breadcrumb>
          <span>{taskName}</span>
          <span>{trigger.body}</span>
        </Breadcrumb>
      }
      footer={<ButtonGroup>TODO Button here</ButtonGroup>}
      onClose={onClose}
    >
      <div className={S.editor}>
        <ParametersStack>
          <Field name={t('name')}>{trigger.name}</Field>
          <InputLayout id="body" header={t('body')}>
            <TriggerBodyView
              editable
              triggerType={name}
              body={body}
              onChange={setBody}
            />
          </InputLayout>
        </ParametersStack>
      </div>
    </ModalDialog>
  );
}

export default TriggerPopupEditor;
