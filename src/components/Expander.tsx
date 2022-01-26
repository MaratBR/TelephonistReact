import { css } from "@emotion/react";
import React from "react";

type ExpanderProps = React.PropsWithChildren<{ expanded: boolean }>;

const expanderCSS = css`
  transition: max-height var(--t-transition-lg);
  max-height: 100%;
  overflow: hidden;
`;

const hiddenCSS = css`
  max-height: 0;
`;

function Expander({ expanded, children }: ExpanderProps) {
  return (
    <div css={[expanderCSS, expanded ? undefined : hiddenCSS]}>{children}</div>
  );
}

export default React.memo(Expander);
