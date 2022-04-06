import { useSearchParams } from 'react-router-dom';

export default function useSearchParam(name: string): [string, (value: string) => void] {
  const [search, setSearch] = useSearchParams();

  const value = search.get(name);

  return [
    value,
    (newValue) => {
      search.set(name, newValue);
      setSearch(search);
    },
  ];
}

export function usePageParam(): [number, (value: number) => void] {
  const [pageStr, setPage] = useSearchParam('page');

  let page = +pageStr;
  if (Number.isNaN(page) || page < 1) {
    page = 1;
  } else {
    page = Math.floor(page);
  }
  return [
    page,
    (newPage) => {
      setPage(`${newPage}`);
    },
  ];
}
