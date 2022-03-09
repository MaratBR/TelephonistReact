import React from 'react';
import S from './NavGroup.module.scss';

type NavGroupProps = React.PropsWithChildren<{
  text: string;
  icon?: string;
}>;

function NavGroup({ children, text, icon }: NavGroupProps) {
  return (
    <li>
      <div className={S.header}>
        <span>{icon}</span>
        <span>{text}</span>
      </div>

      <div>{children}</div>
    </li>
  );
}

export default NavGroup;
