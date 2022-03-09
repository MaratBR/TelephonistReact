import { Button } from '@coreui/Button';
import ButtonGroup from '@coreui/ButtonGroup';
import { Input, Select } from '@coreui/Input';
import Table from '@coreui/Table';
import { mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { DEFAULT_TRIGGER_BODY, TRIGGER_EVENT, UpdateTask } from 'api/definition';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Shruggie } from 'ui/misc';

type TaskTriggersProps = {
  control: Control<UpdateTask>;
};

function TaskTriggers({ control }: TaskTriggersProps) {
  const { t } = useTranslation();

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'triggers',
  });

  // header and footer rows
  const hRow = (
    <tr>
      <th>{t('#')}</th>
      <th>{t('triggerType')}</th>
      <th>{t('triggerBody')}</th>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <th />
    </tr>
  );

  return (
    <>
      <ButtonGroup>
        <Button
          color="primary"
          left={<Icon size={0.7} path={mdiPlus} />}
          onClick={() => append({ name: TRIGGER_EVENT, body: '' })}
        >
          {t('addTrigger')}
        </Button>
      </ButtonGroup>
      <Table>
        <thead>{hRow}</thead>
        <tbody>
          {fields.length ? undefined : (
            <Shruggie>
              <p>{t('noTaskTriggersDefined')}</p>
            </Shruggie>
          )}
          {fields.map((trigger, index) => (
            <tr>
              <td width="40px">{index + 1}</td>
              <td width="20%">
                <Controller
                  control={control}
                  name={`triggers.${index}.name`}
                  render={({ field: { onChange, value } }) => (
                    <Select<string>
                      value={value}
                      onChange={onChange}
                      options={Object.keys(DEFAULT_TRIGGER_BODY)}
                      keyFactory={(v) => v}
                    />
                  )}
                />
              </td>
              <td>
                <Input {...control.register(`triggers.${index}.body`)} />
              </td>
              <td width="70px">
                <ButtonGroup>
                  <Button onClick={() => remove(index)} color="danger" variant="ghost">
                    {t('delete')}
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>{hRow}</tfoot>
      </Table>
    </>
  );
}

export default TaskTriggers;
