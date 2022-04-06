import React from 'react';
import { InputBoxVariant } from '@ui/Input/InputBox';
import { Stack } from '@ui/Stack';
import { Text } from '@ui/Text';
import Input from 'core/components/Input/Input';
import Tag from 'core/components/Tag';
import { useTranslation } from 'react-i18next';

interface TagsInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'dafaultValue' | 'type' | 'onChange'
  > {
  value?: TagDescriptor[];
  // eslint-disable-next-line no-unused-vars
  onRawTags?: (tags: TagDescriptor[]) => void;
  // eslint-disable-next-line no-unused-vars
  onChange?: (tags: string[]) => void;
  // eslint-disable-next-line no-unused-vars
  onTagRemoved?: (tag: TagDescriptor, oldIndex: number) => void;
  // eslint-disable-next-line no-unused-vars
  onTagAdded?: (tag: TagDescriptor, newIndex: number) => void;
  variant?: InputBoxVariant;
  submitOnSpace?: boolean;
  disallowDuplicates?: boolean;
}

type TagObject = {
  key: string;
  render?: () => React.ReactNode;
  color?: string;
};
type TagDescriptor = string | TagObject;

interface TagDisplayProps {
  tags: TagDescriptor[];
}

export function TagDisplay({ tags }: TagDisplayProps) {
  return (
    <Stack h wrap spacing="sm">
      {tags.map((tag) =>
        typeof tag === 'string' ? (
          <Tag key={tag}>{tag}</Tag>
        ) : (
          <Tag key={tag.key}>{tag.render ? tag.render() : tag.key}</Tag>
        )
      )}
    </Stack>
  );
}

function TagInput({
  variant,
  disallowDuplicates,
  submitOnSpace,
  value,
  onRawTags,
  onChange,
  onTagAdded,
  onTagRemoved,
  ...props
}: TagsInputProps) {
  const { t } = useTranslation();
  const tagsChildren = (value ?? []).map((tag, index) => {
    const onClose = () => {
      const newTags = [...value];
      newTags.splice(index, 1);
      if (onRawTags) onRawTags(newTags);
      if (onChange) {
        onChange(newTags.map((newTag) => (typeof newTag === 'string' ? newTag : newTag.key)));
      }
      if (onTagRemoved) onTagRemoved(value[index], index);
    };
    const tagValue = tag;
    if (typeof tagValue === 'string') {
      return (
        <Tag closeable onClose={onClose} key={tagValue}>
          {tagValue}
        </Tag>
      );
    }
    return (
      <Tag closeable onClose={onClose} key={tagValue.key} color={tagValue.color}>
        {tagValue.render ? tagValue.render() : tagValue.key}
      </Tag>
    );
  });

  const onSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || (submitOnSpace && e.key === ' ')) {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const inputValue = target.value.trim();
      if (inputValue === '') return;
      if (
        disallowDuplicates &&
        value.some((tag) => (typeof tag === 'string' ? tag === inputValue : tag.key === inputValue))
      ) {
        target.value = '';
        return;
      }
      const newTags = [...value, inputValue];

      if (onRawTags) onRawTags(newTags);
      if (onChange) {
        onChange(newTags.map((tag) => (typeof tag === 'string' ? tag : tag.key)));
      }
      if (onTagAdded) onTagAdded(inputValue, value.length);
      target.value = '';
    }
  };

  return (
    <div>
      <Input variant={variant} {...props} onKeyDown={onSubmit} />
      <Text type="hint">{t('tagInputHint')}</Text>
      <Stack h spacing="xs" alignItems="center" wrap>
        {tagsChildren}
      </Stack>
    </div>
  );
}

export default TagInput;
