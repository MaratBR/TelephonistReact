import React from 'react';
import { css } from '@emotion/react';
import img from 'assets/bg_texture.png';

const css_ = css`
  height: 100vh;
  display: grid;
  grid-template-columns: 30% 70%;

  & > aside {
    width: 30vw;
    background-image: url(${img});
    background-size: 600px;
  }

  & > main {
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  }
`;

export default function SerenityLayout({ children }: React.PropsWithChildren<unknown>) {
  return (
    <div css={css_}>
      <aside />
      <main>{children}</main>
    </div>
  );
}
