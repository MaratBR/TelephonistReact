import styled from "@emotion/styled";

const variants = {};

type TableVariant = "";

export default styled.table`
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    padding: var(--t-spacing-md);
  }

  td {
    &:focus {
      outline: 1px solid;
    }
  }

  tr {
    border-bottom: 1px solid var(--t-neutral-8);
  }

  & > thead,
  & > tfoot {
    th {
      font-weight: 400;
      text-align: start;
      line-height: 1.5em;
      cursor: default;
    }
  }

  & > tbody {
  }
`;
