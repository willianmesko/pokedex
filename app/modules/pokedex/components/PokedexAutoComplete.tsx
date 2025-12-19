"use client";

import { useState } from "react";
import { SearchInput } from "./SearchInput";
import { usePokedexAutocomplete } from "@modules/pokedex/hooks/usePokedexAutocomplete";
import { cn } from "@/utils/cn";

interface PokemonAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
}

export function PokemonAutocomplete({
  value,
  onChange,
  onSelect,
}: PokemonAutocompleteProps) {
  const [open, setOpen] = useState(false);

  const { data = [], isLoading } = usePokedexAutocomplete(value);

  return (
    <div className="relative">
      <SearchInput
        value={value}
        onChange={(v) => {
          onChange(v);
          setOpen(true);
        }}
      />

      {open && value.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-card shadow-lg">
          {isLoading && (
            <div className="p-3 text-sm text-muted-foreground">Searching…</div>
          )}

          {!isLoading && data.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">No results</div>
          )}

          {!isLoading &&
            data.map((pokemon) => (
              <button
                key={pokemon.id}
                type="button"
                onClick={() => {
                  onSelect(pokemon.name);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-3 py-2 text-left text-sm",
                  "hover:bg-muted focus:bg-muted"
                )}
              >
                #{pokemon.id.toString().padStart(3, "0")} — {pokemon.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
