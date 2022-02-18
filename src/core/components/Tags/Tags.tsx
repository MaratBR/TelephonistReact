import S from './Tags.module.scss';
import Tag from 'core/components/Tag';

type TagsProps = {
  tags?: string[];
};

export default function Tags({ tags }: TagsProps) {
  return (
    <div className={S.tags}>
      {(tags ?? []).map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
  );
}
