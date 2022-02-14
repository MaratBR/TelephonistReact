import { InputBoxVariant } from '@cc/Input/InputBox';
import { Stack } from '@cc/Stack';
import { css } from '@emotion/react';
import Input from 'core/components/Input/Input';
import Tag from 'core/components/Tag';
import React from 'react';

interface TagsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tags: TagDescriptor[];
  // eslint-disable-next-line no-unused-vars
  onRawTags?: (tags: TagDescriptor[]) => void;
  // eslint-disable-next-line no-unused-vars
  onTags?: (tags: string[]) => void;
  // eslint-disable-next-line no-unused-vars
  onTagRemoved?: (tag: TagDescriptor, oldIndex: number) => void;
  // eslint-disable-next-line no-unused-vars
  onTagAdded?: (tag: TagDescriptor, newIndex: number) => void;
  variant?: InputBoxVariant;
  inline?: boolean;
  submitOnSpace?: boolean;
  disallowDuplicates?: boolean;
}

type TagObject = {
  key: string;
  render?: () => React.ReactNode;
  color?: string;
};
type TagDescriptor = string | TagObject;

const _css = css`
  & > * {
    margin-bottom: var(--t-spacing-md);
  }
`;

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
  inline,
  disallowDuplicates,
  submitOnSpace,
  tags,
  onRawTags,
  onTags,
  onTagAdded,
  onTagRemoved,
  ...props
}: TagsInputProps) {
  const tagsChildren = tags.map((tag, index) => {
    const onClose = () => {
      const newTags = [...tags];
      newTags.splice(index, 1);
      if (onRawTags) onRawTags(newTags);
      if (onTags) {
        onTags(
          newTags.map((newTag) =>
            typeof newTag === 'string' ? newTag : newTag.key
          )
        );
      }
      if (onTagRemoved) onTagRemoved(tags[index], index);
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
      <Tag
        closeable
        onClose={onClose}
        key={tagValue.key}
        color={tagValue.color}
      >
        {tagValue.render ? tagValue.render() : tagValue.key}
      </Tag>
    );
  });

  const onSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || (submitOnSpace && e.key === ' ')) {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const value = target.value.trim();
      if (value === '') return;
      if (
        disallowDuplicates &&
        tags.some((t) =>
          typeof t === 'string' ? t === value : t.key === value
        )
      ) {
        target.value = '';
        return;
      }
      const newTags = [...tags, value];

      if (onRawTags) onRawTags(newTags);
      if (onTags) {
        onTags(newTags.map((tag) => (typeof tag === 'string' ? tag : tag.key)));
      }
      if (onTagAdded) onTagAdded(value, tags.length);
      target.value = '';
    }
  };

  return (
    <div css={_css}>
      <Input variant={variant} {...props} onKeyDown={onSubmit} />
      <Stack h spacing="xs" alignItems="center" wrap>
        {tagsChildren}
      </Stack>
    </div>
  );
}

export default TagInput;
