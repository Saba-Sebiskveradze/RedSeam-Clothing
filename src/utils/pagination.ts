interface PaginationNumbersProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const generatePaginationNumbers = ({
  currentPage,
  totalPages
}: Omit<PaginationNumbersProps, 'onPageChange'>): (number | string)[] => {
  if (totalPages === 0) return [];

  const pages: (number | string)[] = [];

  pages.push(1);

  if (currentPage === 1 || currentPage === 2) {
    if (totalPages > 1) {
      pages.push(2);
    }
  } else if (currentPage === totalPages || currentPage === totalPages - 1) {
    if (totalPages > 1) {
      pages.push(2);
    }
  } else {
    pages.push(currentPage);
  }

  if (totalPages > 4) {
    pages.push('...');
  }

  if (totalPages > 3 && !pages.includes(totalPages - 1)) {
    pages.push(totalPages - 1);
  }

  if (totalPages > 2 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
};