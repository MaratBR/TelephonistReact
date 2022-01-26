import styled from "@emotion/styled";
import { cssVar } from "./theme";

interface StackProps {
  spacing?: string;
}

export default styled.div<StackProps>`
  display: flex;
  align-items: stretch;
  flex-direction: column;
  align-items: stretch;
  ${(p) =>
    p.spacing
      ? `& > :not(:first-child) {
    margin-block-start: ${cssVar("spacing", p.spacing)};
  }`
      : ""}
`;
