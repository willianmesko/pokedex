"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/utils/cn";

interface AppPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AppPagination({
  page,
  totalPages,
  onPageChange,
  onNext,
  onPrev,
}: AppPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => {
      if (totalPages <= 7) return true;
      if (p === 1 || p === totalPages) return true;
      if (Math.abs(p - page) <= 1) return true;
      return false;
    }
  );

  return (
    <div className=" w-full pb-12">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={onPrev}
              className={cn(page === 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>

          {pages.map((p, idx) => (
            <PaginationItem key={p}>
              {idx > 0 && pages[idx - 1] !== p - 1 && <PaginationEllipsis />}
              <PaginationLink
                onClick={() => onPageChange(p)}
                isActive={page === p}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={onNext}
              className={cn(
                page === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
