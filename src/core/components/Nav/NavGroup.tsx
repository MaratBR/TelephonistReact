import { css } from '@emotion/react';
import React from 'react';

type NavGroupProps = React.PropsWithChildren<{
  text: string;
  icon?: string;
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

function NavGroup({ children, text, icon }: NavGroupProps) {
  return (
    <li>
      <div css={headerCSS}>
        <span>{icon}</span>
        <span>{text}</span>
      </div>

      <div>{children}</div>
    </li>
  );
}

export default NavGroup;
