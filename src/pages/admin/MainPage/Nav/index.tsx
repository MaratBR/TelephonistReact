import S from './Nav.module.scss';
import styled from '@emotion/styled';

interface NavProps {
  children?: React.ReactNode;
}

function Nav({ children }: NavProps) {
  return <div className={S.nav}>{children}</div>;
}

const NavItems = styled.ul`
  padding: 0;
  list-style: none;
`;

export { default as NavGroup } from './NavGroup';
export { default as NavItem } from './NavItem';
export { Nav, NavItems };
