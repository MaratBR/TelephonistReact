import React from 'react';
import { Checkbox } from '@ui/Input';
import { Stack } from '@ui/Stack';
import { mdiCalendar, mdiCheckCircle, mdiCloseCircle } from '@mdi/js';
import Icon from '@mdi/react';
import Table from 'core/components/Table';

type StrKeyOf<T> = keyof T & string;
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

function defaultRender(o: any): React.ReactNode {
  if (o === null || typeof o === 'undefined') return o;
  return o.toString();
}

const fullOf = (len: number, v: boolean) => new Array(len).fill(0).map(() => v);

interface DataRowProps<T> {
  columns: DataGridColumnObject<T>[];
  selectable: boolean;
  selected: boolean;
  onSelected?: (value: boolean) => void;
  item: T;
}

function DataRow<T>({
  selectable,
  selected,
  onSelected,
  columns,
  item,
}: DataRowProps<T>) {
  return (
    <tr>
      {selectable ? (
        <td>
          <Checkbox
            checked={selected}
            onChange={
              onSelected ? (e) => onSelected!(e.target.checked) : undefined
            }
          />
        </td>
      ) : undefined}
      {columns.map((c) => (
        <td>
          {isCustom(c)
            ? c.render(item)
            : (c.render ?? defaultRender)(item[c.key])}
        </td>
      ))}
    </tr>
  );
}

interface DataGridState {
  selected: boolean[];
  selectedCount: number;
}

export type DataGridProps<T> = {
  data: T[];
  columns?: DataGridColumn<T>[];
  selectable?: boolean;
  keyFactory: (value: T) => React.Key;
  noItemsRenderer?: () => React.ReactNode;
  onSelect?: (selected: T[]) => void;
};

export class DataGrid<T> extends React.Component<
  DataGridProps<T>,
  DataGridState
> {
  constructor(props: Readonly<DataGridProps<T>>) {
    super(props);
    this.state = {
      selected: fullOf(this._length, false),
      selectedCount: 0,
    };
  }

  private get _length() {
    const { data } = this.props;
    return data ? data.length : 0;
  }

  private _setAllSelected(selected: boolean) {
    this.setState({
      selected: fullOf(this._length, selected),
      selectedCount: selected ? this._length : 0,
    });
    const { data, onSelect } = this.props;
    if (onSelect) {
      onSelect(selected ? [...data] : []);
    }
  }

  private _isAllSelected(): boolean | null {
    const { selectedCount } = this.state;
    if (selectedCount === 0) return false;
    if (selectedCount === this._length) return true;
    return null;
  }

  private _select(index: number, isSelected: boolean) {
    const { selected, selectedCount } = this.state;
    const { data, onSelect } = this.props;
    if (selected[index] !== isSelected) {
      const newSelect = [...selected];
      newSelect[index] = isSelected;
      this.setState(
        {
          selected: newSelect,
          selectedCount: selectedCount + (selected ? 1 : -1),
        },
        () => {
          if (onSelect) {
            onSelect(data.filter((_, idx) => selected[idx]));
          }
        }
      );
    }
  }

  private _renderHeader() {
    const isAllSelected = this._isAllSelected();
    const { selectable, columns } = this.props;
    return (
      <tr>
        {selectable ? (
          <th>
            <Checkbox
              onChange={(e) => this._setAllSelected(e.target.checked)}
              checked={isAllSelected === true}
              indeterminate={isAllSelected === null}
            />
          </th>
        ) : undefined}
        {columns.map((c) =>
          typeof c === 'string' ? (
            <th key={c}>{c}</th>
          ) : (
            <th key={c.key}>{c.title}</th>
          )
        )}
      </tr>
    );
  }

  private _renderBody(columns: DataGridColumnObject<T>[]) {
    const { data, noItemsRenderer, selectable, keyFactory } = this.props;
    const { selected } = this.state;

    if (this._length > 0) {
      return data.map((value, i) => (
        <DataRow<T>
          selected={selected[i]}
          onSelected={(v) => this._select(i, v)}
          selectable={selectable}
          key={keyFactory(value)}
          columns={columns}
          item={value}
        />
      ));
    }
    if (noItemsRenderer) {
      return (
        <td colSpan={columns ? columns.length + 1 : 1}>{noItemsRenderer()}</td>
      );
    }
    return null;
  }

  render() {
    const header = this._renderHeader();
    const { columns } = this.props;
    const objectColumns = columns.map((c) =>
      typeof c === 'object' ? c : { key: c, title: c }
    );

    return (
      <Table>
        <thead>{header}</thead>
        <tbody>{this._renderBody(objectColumns)}</tbody>
        <tfoot>{header}</tfoot>
      </Table>
    );
  }
}

export function renderObjectID(id: string) {
  return (
    <code>
      {id.substring(0, 6)}
      ...
      {id.substring(18, 24)}
    </code>
  );
}

export function dateRender(d: string) {
  const dt = new Date(d);
  return (
    <Stack h>
      <Icon color="var(--t-color-2)" path={mdiCalendar} size={0.9} />
      {dt.toLocaleString()}
    </Stack>
  );
}

export function renderBoolean(b: boolean): React.ReactNode {
  return b ? (
    <Icon size={1} path={mdiCheckCircle} color="var(--t-success)" />
  ) : (
    <Icon size={1} path={mdiCloseCircle} color="var(--t-danger)" />
  );
}
