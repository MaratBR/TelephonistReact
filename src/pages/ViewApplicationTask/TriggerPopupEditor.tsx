import { useState } from 'react';
import { Breadcrumb } from '@ui/Breadcrumb';
import ButtonGroup from '@ui/ButtonGroup';
import { Field } from '@ui/Field';
import { InputLayout } from '@ui/Input';
import { ModalDialog } from '@ui/Modal';
import TriggerBodyView from './TriggerBodyView';
import S from './TriggerPopupEditor.module.scss';
import { TRIGGER_EVENT, TaskTrigger } from 'api/definition';
import { useApi } from 'api/hooks';
import { ParametersStack } from 'pages/parts/Parameters';
import { useTranslation } from 'react-i18next';

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
