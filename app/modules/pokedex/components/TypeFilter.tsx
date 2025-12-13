import { ALL_TYPES, TYPE_COLORS } from "@modules/pokedex/constants";
import type { PokemonType } from "@modules/pokedex/entities/pokemon";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

interface TypeFilterProps {
  selectedType: PokemonType | null;
  onTypeChange: (type: PokemonType | null) => void;
}

export const TypeFilter = ({ selectedType, onTypeChange }: TypeFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-11 gap-2 border-2 bg-card transition-all",
            selectedType && "border-primary/50"
          )}
        >
          <Filter className="h-4 w-4" />
          {selectedType ? (
            <span className="capitalize">{selectedType}</span>
          ) : (
            "All Types"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Filter by Type</span>
          {selectedType && (
            <button
              onClick={() => onTypeChange(null)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(selectedType === type ? null : type)}
              className={cn(
                "rounded-md px-2 py-1.5 text-xs font-semibold uppercase text-white transition-all",
                TYPE_COLORS[type],
                selectedType === type
                  ? "ring-2 ring-offset-2 ring-foreground scale-105"
                  : "opacity-80 hover:opacity-100 hover:scale-105"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
