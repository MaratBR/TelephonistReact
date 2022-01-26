import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

const _css = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: React.ReactNode;
}

const BreadcrumbItem = styled.div`
  align-items: center;
  display: flex;
`;

const separatorCSS = css`
  padding: 0 var(--t-spacing-md);
  user-select: none;
  display: inline-block;
`;
const Separator = (_: {}) => (
  <div css={separatorCSS}>
    <Icon path={mdiChevronRight} size={1} />
  </div>
);

const Breadcrumb = ({ separator, children, ...props }: BreadcrumbProps) => {
  const childrenArray = React.Children.toArray(children);
  const modifiedChildren = childrenArray.map((child, index) => {
    if (index == childrenArray.length - 1) {
      return <BreadcrumbItem key={index}>{child}</BreadcrumbItem>;
    }
    return (
      <BreadcrumbItem key={index}>
        {child}
        {separator ?? <Separator />}
      </BreadcrumbItem>
    );
  });
  return <div css={_css}>{modifiedChildren}</div>;
};

export default Breadcrumb;
