import { css } from "@emotion/react";
import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";

const _css = css`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  color: var(--t-primary);
  animation: spin 2s linear infinite;
`;

type LoadingSpinnerProps = {
  size?: number | string;
};

const LoadingSpinner = ({ size }: LoadingSpinnerProps) => (
  <Icon css={_css} size={size ?? 2} path={mdiLoading} />
);

export default LoadingSpinner;
