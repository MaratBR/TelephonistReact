import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import { Input, Select } from '@ui/Input';
import Table from '@ui/Table';
import { mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { rest } from 'api/definition';
import { Shruggie } from 'components/ui/misc';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type TaskTriggersProps = {
  control: Control<rest.UpdateTask>;
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
          onClick={() => append({ name: rest.TRIGGER_EVENT, body: '' })}
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
                      options={Object.keys(rest.DEFAULT_TRIGGER_BODY)}
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
