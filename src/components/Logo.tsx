import { css } from "@emotion/react";

const _css = css`
  font-size: 2em;
  font-family: var(--t-font-logo);
  padding: var(--t-spacing-lg) var(--t-spacing-md);
`;

const Logo = ({ size }: { size?: string }) => (
  <span css={_css}>Telephonist</span>
);

export default Logo;
