import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PokemonCardSkeletonProps {
  viewMode: "grid" | "list";
}

export const PokemonCardSkeleton = ({ viewMode }: PokemonCardSkeletonProps) => {
  if (viewMode === "list") {
    return (
      <Card className="flex items-center gap-4 border-2 p-4">
        <Skeleton className="h-20 w-20 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-2">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-2 border-t p-3">
        <Skeleton className="mx-auto h-4 w-24" />
        <div className="flex justify-center gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </Card>
  );
};
