import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { cssVar } from "./theme";

interface StackProps {
  spacing?: string;
  wrap?: boolean;
}

export default styled.div<StackProps>`
  display: flex;
  align-items: center;
  flex-direction: row;
  ${(p) =>
    p.spacing
      ? `& > :not(:first-child) {
          margin-inline-start: ${cssVar("spacing", p.spacing)};
        }
        & > * {
          ${
            p.wrap
              ? "margin-block-end: " + cssVar("spacing", p.spacing) + ";"
              : ""
          }
        }
  `
      : ""}

  flex-wrap: ${(p) => (p.wrap ? "wrap" : "initial")};
`;
