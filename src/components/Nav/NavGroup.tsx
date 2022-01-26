import { css } from "@emotion/react";
import { mdiChevronUp } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";
import { Expander } from "..";

type NavGroupProps = React.PropsWithChildren<{
  text: string;
  iconSVG: string;
}>;

const headerCSS = css`
  display: flex;
  align-items: center;
  padding: var(--t-spacing-md);
  font-size: 0.75em;
  cursor: pointer;
  margin: var(--t-spacing-md);
  text-transform: uppercase;
`;

const groupCSS = css``;

function NavGroup({ children, text }: NavGroupProps) {
  return (
    <li>
      <div css={headerCSS}>
        <span>{text}</span>
      </div>

      <div css={groupCSS}>{children}</div>
    </li>
  );
}

export default NavGroup;
