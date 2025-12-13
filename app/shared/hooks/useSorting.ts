import { useState, useMemo } from "react";

export type SortOption = "id-asc" | "id-desc" | "name-asc" | "name-desc";
export type ApiSortField = "id" | "name";
export type ApiSortOrder = "asc" | "desc";

export function useSorting(initial: SortOption = "id-asc") {
  const [sortOption, setSortOption] = useState<SortOption>(initial);

  const { apiSort, apiOrder } = useMemo<{
    apiSort: ApiSortField;
    apiOrder: ApiSortOrder;
  }>(() => {
    const [field, order] = sortOption.split("-") as [
      ApiSortField,
      ApiSortOrder
    ];

    return {
      apiSort: field,
      apiOrder: order,
    };
  }, [sortOption]);

  return {
    sortOption,
    setSortOption,

    apiSort,
    apiOrder,
  };
}
