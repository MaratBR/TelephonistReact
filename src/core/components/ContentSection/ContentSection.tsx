import React from 'react';
import S from './ContentSection.module.scss';
import classNames from 'classnames';
import { Heading } from 'core/components/Text';

type ContentSectionProps = React.PropsWithChildren<{
  header?: React.ReactNode;
  padded?: boolean;
  asideContent?: React.ReactNode;
}>;

export default function ContentSection({
  header,
  children,
  padded,
  asideContent,
}: ContentSectionProps) {
  return (
    <div className={S.section}>
      {header ? (
        <div className={S.header}>
          <Heading as="h3">{header}</Heading>
        </div>
      ) : undefined}
      <div className={classNames(S.body, { [S.padded]: padded })}>
        {children}
      </div>
      {asideContent ? (
        <aside className={S.aside}>{asideContent}</aside>
      ) : undefined}
    </div>
  );
}
