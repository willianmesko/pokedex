import { useState, useCallback } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  totalPages?: number;
}

export function usePagination({
  initialPage = 1,
  totalPages,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);

  const nextPage = useCallback(() => {
    setPage((p) => (totalPages ? Math.min(p + 1, totalPages) : p + 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goToPage = useCallback((p: number) => {
    setPage(Math.max(1, p));
  }, []);

  return {
    page,
    setPage: goToPage,
    nextPage,
    prevPage,
  };
}
