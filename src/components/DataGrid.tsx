import { css } from "@emotion/react";
import {
  mdiCalendar,
  mdiCheckCircle,
  mdiClock,
  mdiClose,
  mdiCloseCircle,
  mdiCross,
} from "@mdi/js";
import Icon from "@mdi/react";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect } from "react";
import HStack from "./HStack";
import Checkbox from "./Checkbox";
import Table from "./Table";

type StrKeyOf<T> = keyof T & string;
type ValueOf<T> = T[keyof T];
type DataGridColumnObjectField<T, K extends StrKeyOf<T>> = {
  key: K;
  title: React.ReactNode;
  render?: (value: T[K]) => React.ReactNode;
  custom?: false;
};
type DataGridColumnObject<T, K extends StrKeyOf<T> = StrKeyOf<T>> =
  | DataGridColumnObjectField<T, K>
  | GenericDataGridColumnObject<T>;

type GenericDataGridColumnObject<T> = {
  key: string;
  render: (value: T) => React.ReactNode;
  title: React.ReactNode;
  custom: true;
};

function isCustom<T, K extends StrKeyOf<T>>(
  o: DataGridColumnObject<T, K>
): o is GenericDataGridColumnObject<T> {
  return o.custom;
}

export type DataGridColumn<T> = StrKeyOf<T> | DataGridColumnObject<T>;

export type DataGridProps<T> = {
  data: T[];
  columns?: DataGridColumn<T>[];
  selectable?: boolean;
  keyFactory: (value: T) => React.Key;
  noItemsRenderer?: () => React.ReactNode
};

function defaultRender(o: any): React.ReactNode {
  if (o === null || typeof o === "undefined") return o;
  return o.toString();
}

const fullOf = (len: number, v: boolean) => new Array(len).fill(0).map(() => v);

interface DataGridState {
  selected: boolean[];
  selectedCount: number;
}

interface DataRowProps<T> {
  columns: DataGridColumnObject<T>[];
  selectable: boolean;
  selected: boolean;
  onSelected?: (value: boolean) => void;
  item: T;
}

function DataRow<T>(props: DataRowProps<T>) {
  return (
    <tr>
      {props.selectable ? (
        <td>
          <Checkbox
            checked={props.selected}
            onChange={
              props.onSelected
                ? (e) => props.onSelected!(e.target.checked)
                : undefined
            }
          />
        </td>
      ) : undefined}
      {props.columns.map((c) => (
        <td>
          {isCustom(c)
            ? c.render(props.item)
            : (c.render ?? defaultRender)(props.item[c.key])}
        </td>
      ))}
    </tr>
  );
}

class DataGrid<T> extends React.Component<DataGridProps<T>, DataGridState> {
  constructor(props: Readonly<DataGridProps<T>>) {
    super(props);
    this.state = {
      selected: fullOf(this._length, false),
      selectedCount: 0,
    };
  }

  private get _length() {
    return this.props.data ? this.props.data.length : 0
  }

  private _setAllSelected(selected: boolean) {
    this.setState({
      selected: fullOf(this._length, selected),
      selectedCount: selected ? this._length : 0,
    });
  }

  private _isAllSelected(): boolean | null {
    if (this.state.selectedCount === 0) return false;
    else if (this.state.selectedCount === this._length) return true;
    else return null;
  }

  private _select(index: number, selected: boolean) {
    if (this.state.selected[index] !== selected) {
      const newSelect = [...this.state.selected];
      newSelect[index] = selected;
      this.setState({
        selected: newSelect,
        selectedCount: this.state.selectedCount + (selected ? 1 : -1)
      });
    }
  }

  private _renderHeader() {
    const isAllSelected = this._isAllSelected();
    return (
      <tr>
        {this.props.selectable ? (
          <th>
            <Checkbox
              onChange={(e) => this._setAllSelected(e.target.checked)}
              checked={isAllSelected === true}
              indeterminate={isAllSelected === null}
            />
          </th>
        ) : undefined}
        {this.props.columns.map((c) =>
          typeof c === "string" ? (
            <th key={c}>{c}</th>
          ) : (
            <th key={c.key}>{c.title}</th>
          )
        )}
      </tr>
    );
  }

  private _renderBody(columns: DataGridColumnObject<T>[]) {
    if (this._length > 0) {
      return this.props.data.map((v, i) => (
        <DataRow<T>
          selected={this.state.selected[i]}
          onSelected={(v) => this._select(i, v)}
          selectable={this.props.selectable}
          key={this.props.keyFactory(v)}
          columns={columns}
          item={v}
        />
      ))
    } else if (this.props.noItemsRenderer) {
      return <td colSpan={this.props.columns ? this.props.columns.length + 1 : 1}>
        {this.props.noItemsRenderer()}
      </td>
    } else {
      return null
    }
  }

  render() {
    const header = this._renderHeader();
    const columns = this.props.columns.map((c) =>
      typeof c === "object" ? c : { key: c, title: c }
    );

    return (
      <Table>
        <thead>{header}</thead>
        <tbody>
          {this._renderBody(columns)}
        </tbody>
        <tfoot>{header}</tfoot>
      </Table>
    );
  }
}

export default DataGrid;

export function renderObjectID(id: string) {
  return (
    <code>
      {id.substring(0, 6)}...{id.substring(18, 24)}
    </code>
  );
}

export function dateRender(d: string) {
  const dt = new Date(d);
  return (
    <HStack>
      <Icon color="var(--t-color-2)" path={mdiCalendar} size={0.9} />
      {dt.toLocaleString()}
    </HStack>
  );
}

export function renderBoolean(b: boolean): React.ReactNode {
  return b ? (
    <Icon size={1} path={mdiCheckCircle} color={"var(--t-success)"} />
  ) : (
    <Icon size={1} path={mdiCloseCircle} color={"var(--t-danger)"} />
  );
}
