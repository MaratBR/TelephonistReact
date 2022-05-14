import React from 'react';
import { Input, InputLayout, Textarea } from '@ui/Input';
import TagInput from '@ui/TagInput';
import { UpdateApplication } from 'api/definition';
import { ParametersStack } from 'components/ui/Parameters';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type EditApplicationProps = {
  control: Control<UpdateApplication>;
};

export default function EditApplication({ control }: EditApplicationProps) {
  const { t } = useTranslation();
  const { register } = control;

  return (
    <ParametersStack>
      <InputLayout id="name" header={t('displayName')}>
        <Input id="name" {...register('display_name')} />
      </InputLayout>
      <InputLayout id="description" header={t('description')}>
        <Textarea id="description" placeholder={t('description')} {...register('description')} />
      </InputLayout>
      <InputLayout id="tags" header={t('tags')}>
        <Controller
          control={control}
          name="tags"
          render={({ field: { value, onChange } }) => (
            <TagInput onChange={onChange} value={value} placeholder={t('tags')} />
          )}
        />
      </InputLayout>
    </ParametersStack>
  );
}
