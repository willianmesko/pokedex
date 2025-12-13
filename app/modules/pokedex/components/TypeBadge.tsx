import { cn } from "@/utils/cn";
import { TYPE_COLORS } from "@modules/pokedex/constants";
import { PokemonType } from "@modules/pokedex/entities/pokemon";

interface TypeBadgeProps {
  type: PokemonType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const TypeBadge = ({ type, size = "md", className }: TypeBadgeProps) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-wider text-white shadow-sm transition-transform hover:scale-105",
        TYPE_COLORS[type],
        sizeClasses[size],
        className
      )}
    >
      {type}
    </span>
  );
};
