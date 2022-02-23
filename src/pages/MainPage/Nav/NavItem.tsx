import S from './NavItem.module.scss';
import Icon from '@mdi/react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

type NavItemProps = {
  iconSVG?: string;
  to: string;
};

function NavItem({ to, iconSVG, children }: React.PropsWithChildren<NavItemProps>) {
  return (
    <NavLink end to={to} className={({ isActive }) => classNames(S.item, { [S.active]: isActive })}>
      <div className={S.inner}>
        <div className={S.icon}>
          <Icon path={iconSVG} size={0.7} />
        </div>
        <div className={S.content}>{children}</div>
      </div>
    </NavLink>
  );
}

export default NavItem;
