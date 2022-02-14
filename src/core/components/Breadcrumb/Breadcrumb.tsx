import { mdiChevronRight } from '@mdi/js';
import Icon from '@mdi/react';
import classNames from 'classnames';
import React from 'react';
import S from './Breadcrumb.module.scss';

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: React.ReactNode;
}

function Separator() {
  return (
    <div className={S.separator}>
      <Icon path={mdiChevronRight} size={1} />
    </div>
  );
}

function Breadcrumb({
  separator,
  className,
  children,
  ...props
}: BreadcrumbProps) {
  const separatorInstance = separator ?? <Separator />;
  const modifiedChildren = React.Children.map(children, (child) => (
    <div className={S.item}>
      {child}
      {separatorInstance}
    </div>
  ));
  return (
    <div {...props} className={classNames(className, S.breadcrumb)}>
      {modifiedChildren}
    </div>
  );
}

export default Breadcrumb;
