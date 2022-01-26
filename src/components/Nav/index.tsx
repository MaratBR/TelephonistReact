import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { HStack } from "..";

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

export { Nav, NavItems };
export { default as NavItem } from "./NavItem";
export { default as NavGroup } from "./NavGroup";
