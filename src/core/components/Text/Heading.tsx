import { css } from '@emotion/react';

interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
}

const _css = css`
  font-family: var(--t-font-headers);
`;

function Heading({ as, ...props }: HeadingProps) {
  const HTMLTag = as ?? 'h1';
  return <HTMLTag css={_css} {...props} />;
}

export default Heading;
