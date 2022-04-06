import Pagination from '@ui/Pagination';
import S from './index.module.scss';
import classNames from 'classnames';

interface PaginationLayoutProps {
  totalPages?: number;
  selectedPage: number;
  loading?: boolean;
  children?: React.ReactNode;
  onSelect: (page: number) => void;
}

export default function PaginationLayout({
  totalPages,
  selectedPage,
  loading,
  children,
  onSelect,
}: PaginationLayoutProps) {
  const pagination = (
    <Pagination
      onSelect={onSelect}
      firstPage={1}
      lastPage={totalPages ?? 1}
      selectedPage={selectedPage}
    />
  );

  return (
    <>
      {pagination}
      <section className={classNames(S.overlay, { [S.loading]: loading })}>{children}</section>
      {pagination}
    </>
  );
}
