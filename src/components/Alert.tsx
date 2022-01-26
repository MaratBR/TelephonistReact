import styled from "@emotion/styled";

interface AlertProps {
  color?: string;
}

const Alert = styled.div<AlertProps>`
  padding: var(--t-spacing-lg);
  border-radius: var(--t-radius-sm);
  background-color: ${(props) => `var(--t-${props.color ?? "primary"}-100)`};
`;

export default Alert;
