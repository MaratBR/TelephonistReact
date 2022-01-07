import { Code, Table, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import { dataAttr } from "@chakra-ui/utils";
import React from "react";

type ColumnConfig = {
  title?: React.ReactNode;
};
type StrKeyOf<T> = keyof T & string;
type DataGridColumnObject<T, K extends StrKeyOf<T> = StrKeyOf<T>> = {
  key: K;
  title: React.ReactNode;
  render?: (value: T[K]) => React.ReactNode;
};
export type DataGridColumn<T> = StrKeyOf<T> | DataGridColumnObject<T>;

export type DataGridProps<T> = {
  data: T[];
  columns?: DataGridColumn<T>[];
};

function getDefaultColumens<T>(data: T[]): DataGridColumnObject<T>[] {
  const keys: Array<keyof T & string> = [];

  for (let r of data) {
    const ks = Object.keys(r) as Array<keyof T & string>;
    for (let k of ks)
      if (typeof k === "string" && !keys.includes(k)) keys.push(k);
  }
  return keys.map((key) => ({ key, title: key }));
}

function defaultRender(o: any): React.ReactNode {
  if (o === null || typeof o === "undefined") return o;
  return o.toString();
}

export default function DataGrid<T>(props: DataGridProps<T>) {
  const columns: DataGridColumnObject<T>[] = props.columns
    ? props.columns.map((key) =>
        typeof key === "object" ? key : { key, title: key }
      )
    : getDefaultColumens(props.data);
  const header = (
    <Tr>
      {columns.map((c) => (
        <Th key={c.key}>{c.title}</Th>
      ))}
    </Tr>
  );

  return (
    <Table>
      <Thead>{header}</Thead>
      <Tbody>
        {props.data.map((r) => {
          return (
            <Tr>
              {columns.map(({ key, render }) => {
                return <Td>{(render ?? defaultRender)(r[key])}</Td>;
              })}
            </Tr>
          );
        })}
      </Tbody>
      <Tfoot>{header}</Tfoot>
    </Table>
  );
}

export function renderObjectID(id: string) {
  return <Code fontSize=".65em">{id.substring(0, 12)}...</Code>;
}
