import { css, Interpolation } from "@emotion/react";
import React from "react";
import tinycolor, { Instance } from "tinycolor2";
import { IconButton } from "./Button/Button";
import { ThemeData } from "./theme";
import S from "./Tag.module.scss"

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  closeable?: boolean;
  onClose?: () => void;
}


function Tag({ color, children, closeable, ...props }: TagProps) {
  let c: Interpolation<ThemeData>;
  if (color) {
    const tc = tinycolor(color);
    c = css`
      background-color: ${tc.toString()};
      color: ${tc.isLight() ? "black" : "white"};
    `;
  }

  return (
    <div className={S.tag} css={c} {...props}>
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
