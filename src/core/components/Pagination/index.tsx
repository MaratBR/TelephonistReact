import S from './index.module.scss';
import { mdiDotsHorizontal } from '@mdi/js';
import Icon from '@mdi/react';
import classNames from 'classnames';

interface PaginationProps {
  firstPage: number;
  lastPage: number;
  selectedPage: number;
  onSelect: (page: number) => void;
}

export default function Pagination({
  firstPage,
  lastPage,
  selectedPage,
  onSelect,
}: PaginationProps) {
  const SHOWN_ITEMS = 7;

  let first = Math.floor(selectedPage - (SHOWN_ITEMS - 1) / 2);
  let last = Math.floor(selectedPage + (SHOWN_ITEMS - 1) / 2);

  if (first < firstPage && last > lastPage) {
    first = firstPage;
    last = lastPage;
  } else if (first < firstPage) {
    first = firstPage;
    last = firstPage + SHOWN_ITEMS - 1;
  } else if (last > lastPage) {
    last = lastPage;
    first = lastPage - SHOWN_ITEMS + 1;
  }

  const items = [];

  for (let page = first; page <= last; page += 1) {
    items.push(
      <li className={classNames(S.item, { [S.selected]: page === selectedPage })} key={page}>
        <button type="button" onClick={() => onSelect(page)}>
          {page}
        </button>
      </li>
    );
  }

  if (first > firstPage) {
    items.unshift(
      <li
        className={classNames(S.item, { [S.selected]: selectedPage === firstPage })}
        key={firstPage}
      >
        <button type="button" onClick={() => onSelect(firstPage)}>
          {firstPage}
        </button>
      </li>,
      <Icon size={0.9} path={mdiDotsHorizontal} />
    );
  }

  if (last < lastPage) {
    items.push(
      <Icon size={0.9} path={mdiDotsHorizontal} />,
      <li
        className={classNames(S.item, { [S.selected]: selectedPage === lastPage })}
        key={lastPage}
      >
        <button type="button" onClick={() => onSelect(lastPage)}>
          {lastPage}
        </button>
      </li>
    );
  }

  return <ul className={S.pagination}>{items}</ul>;
}
