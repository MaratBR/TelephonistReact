import { css } from "@emotion/react";
import React from "react";
import HStack from "./HStack";
import Input, { InputVariant } from "./Input";
import Tag from "./Tag";

interface TagsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tags: TagDescriptor[];
  onRawTags?: (tags: TagDescriptor[]) => void;
  onTags?: (tags: string[]) => void;
  onTagRemoved?: (tag: TagDescriptor, oldIndex: number) => void;
  onTagAdded?: (tag: TagDescriptor, newIndex: number) => void;
  variant?: InputVariant;
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
    <HStack wrap spacing="sm">
      {tags.map((tag, index) =>
        typeof tag === "string" ? (
          <Tag key={index + tag}>{tag}</Tag>
        ) : (
          <Tag key={index + tag.key}>{tag.render ? tag.render() : tag.key}</Tag>
        )
      )}
    </HStack>
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
      if (onTags)
        onTags(newTags.map((tag) => (typeof tag == "string" ? tag : tag.key)));
      if (onTagRemoved) onTagRemoved(tags[index], index);
    };
    const tagValue = tag;
    if (typeof tagValue == "string") {
      return (
        <Tag closeable onClose={onClose} key={index + tagValue}>
          {tagValue}
        </Tag>
      );
    }
    return (
      <Tag
        closeable
        onClose={onClose}
        key={index + ":" + tagValue.key}
        color={tagValue.color}
      >
        {tagValue.render ? tagValue.render() : tagValue.key}
      </Tag>
    );
  });

  const onSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || (submitOnSpace && e.key == " ")) {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const value = target.value.trim();
      if (value === "") return;
      if (
        disallowDuplicates &&
        tags.some((t) => (typeof t === "string" ? t == value : t.key == value))
      ) {
        target.value = "";
        return;
      }
      const newTags = [...tags, value];

      if (onRawTags) onRawTags(newTags);
      if (onTags)
        onTags(newTags.map((tag) => (typeof tag == "string" ? tag : tag.key)));
      if (onTagAdded) onTagAdded(value, tags.length);
      target.value = "";
    }
  };

  return (
    <div css={_css}>
      <HStack spacing="xs" wrap>
        {tagsChildren}
      </HStack>
      <Input variant={variant} {...props} onKeyDown={onSubmit} />
    </div>
  );
}

export default TagInput;
