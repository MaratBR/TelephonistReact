import styled from '@emotion/styled';

const Nav = styled.nav`
  background-color: var(--t-paper-nav);
  height: 100%;
  border-right: 1px solid var(--t-neutral-9);
  background-color: var(--t-paper);
`;

const NavItems = styled.ul`
  padding: 0;
  list-style: none;
`;

export { default as NavGroup } from './NavGroup';
export { default as NavItem } from './NavItem';
export { Nav, NavItems };
