import { css } from "@emotion/react";
import Icon from "@mdi/react";
import { NavLink } from "react-router-dom";
import { HStack } from "..";

type NavItemProps = {
  iconSVG?: string;
  to: string;
};

const iconCSS = css`
  margin-right: var(--t-spacing-md);
  height: 1.2em;
  width: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const navItemCSS = css`
  padding: var(--t-spacing-md) var(--t-spacing-md) var(--t-spacing-md)
    var(--t-spacing-xl);
  color: inherit;
  display: block;
  line-height: 1.6em;
  margin: var(--t-spacing-md) 0;
  font-family: var(--t-font-headers2);
  position: relative;
  color: var(--t-color-3);

  &:hover {
    color: var(--nav-fg);
    text-transform: none !important;
  }

  &.active {
    &::after {
      content: " ";
      position: absolute;
      display: block;
      height: 100%;
      top: 0;
      width: 4px;
      left: 0;
      background-color: var(--t-primary);
      border-radius: 0 4px 4px 0;
    }
  }
`;

const NavItem = (props: React.PropsWithChildren<NavItemProps>) => {
  return (
    <NavLink end to={props.to} css={navItemCSS}>
      <HStack>
        <div css={iconCSS}>
          <Icon path={props.iconSVG} size={0.7} />
        </div>
        {props.children}
      </HStack>
    </NavLink>
  );
};

export default NavItem;
