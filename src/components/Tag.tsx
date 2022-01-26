import { css, Interpolation } from "@emotion/react";
import React from "react";
import tinycolor, { Instance } from "tinycolor2";
import { IconButton } from "./Button";
import { ThemeData } from "./theme";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  closeable?: boolean;
  onClose?: () => void;
}

const _css = css`
  border-radius: var(--t-radius-sm);
  display: inline-block;
  background-color: var(--t-neutral-7);
  padding: var(--t-spacing-sm) 0 var(--t-spacing-sm) var(--t-spacing-sm);
`;

function Tag({ color, children, closeable, ...props }: TagProps) {
  let c: Interpolation<ThemeData>;
  if (color) {
    const tc = tinycolor(color);
    c = [
      _css,
      css`
        background-color: ${tc.toString()};
        color: ${tc.isLight() ? "black" : "white"};
      `,
    ];
  } else {
    c = _css;
  }

  return (
    <div css={c} {...props}>
      {children}
      {closeable ? (
        <IconButton onClick={() => props?.onClose()}>
          <i className="fa " />
        </IconButton>
      ) : undefined}
    </div>
  );
}

export default React.forwardRef(Tag);
