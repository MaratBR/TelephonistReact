import React from 'react';
import S from './DescriptiveItem.module.scss';

interface DescriptiveItemProps {
  description?: React.ReactNode;
  value: React.ReactNode;
}

export default function DescriptiveItem({ description, value }: DescriptiveItemProps) {
  return (
    <div className={S.item}>
      <div className={S.value}>{value}</div>
      <div className={S.description}>{description}</div>
    </div>
  );
}
