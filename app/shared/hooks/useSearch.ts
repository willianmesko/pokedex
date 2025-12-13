import { useState } from "react";
import { useDebounce } from "./useDebounce";

interface UseSearchOptions {
  debounceMs?: number;
  initialValue?: string;
}

export function useSearch({
  debounceMs = 400,
  initialValue = "",
}: UseSearchOptions = {}) {
  const [search, setSearch] = useState(initialValue);

  const debouncedSearch = useDebounce(search, debounceMs);

  return {
    search,
    setSearch,
    debouncedSearch,
    hasSearch: debouncedSearch.trim().length > 0,
  };
}
