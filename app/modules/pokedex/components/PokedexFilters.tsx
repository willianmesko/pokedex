import { SearchInput } from "./SearchInput";
import { TypeFilter } from "./TypeFilter";
import { SortOption, SortSelect } from "./SortSelect";
import { ViewToggle } from "./ViewToggle";
import { PokemonType } from "../entities/pokemon";

export type PokedexToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;

  selectedType: PokemonType | null;
  onTypeChange: (type: PokemonType | null) => void;

  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;

  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
};

export function PokedexToolbar({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewChange,
}: PokedexToolbarProps) {
  return (
    <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            className="w-full sm:w-72"
          />

          <div className="flex items-center gap-2">
            <TypeFilter
              selectedType={selectedType}
              onTypeChange={onTypeChange}
            />
            <SortSelect value={sortOption} onChange={onSortChange} />
            <ViewToggle viewMode={viewMode} onViewChange={onViewChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
