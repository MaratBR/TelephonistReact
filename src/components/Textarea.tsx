import { css } from "@emotion/react";

const _css = css`
  padding: ;
`;

export default ({
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return <textarea css={_css} {...props} />;
};
