import { css } from "@emotion/react";
import { cssVar } from "./theme";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string | number;
  columns?: number;
  rows?: number;
}

const _css = css`
  display: grid;
`;

function Grid({ gap, columns, rows, ...props }: GridProps) {
  return (
    <div
      css={[
        _css,
        css`
          ${rows ? `grid-template-rows: repeat(${rows}, 1fr);` : ""}
          ${columns ? `grid-template-columns: repeat(${columns}, 1fr);` : ""}
        ${gap
            ? `grid-gap: ${
                typeof gap === "number" ? gap + "px" : cssVar("spacing", gap)
              }`
            : ""}
        `,
      ]}
      {...props}
    />
  );
}

export default Grid;
