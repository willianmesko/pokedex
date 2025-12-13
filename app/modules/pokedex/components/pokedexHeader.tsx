export const PokedexHeader = () => {
  return (
    <header className="relative overflow-hidden bg-primary py-8 px-4">
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -right-5 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-white/10" />
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-4 border-white" />
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-white" />
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-primary" />
        </div>
      </div>
      <div className="container relative">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-4 w-4 animate-pulse rounded-full bg-accent shadow-lg shadow-accent/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-pokemon-fire" />
            <div className="h-2.5 w-2.5 rounded-full bg-pokemon-electric" />
            <div className="h-2.5 w-2.5 rounded-full bg-pokemon-grass" />
          </div>
        </div>

        <h1 className="mt-4 text-3xl font-bold text-primary-foreground md:text-4xl">
          Pokédex
        </h1>
        <p className="mt-1 text-sm text-primary-foreground/80 md:text-base">
          Explore all 151 original Pokémon
        </p>
      </div>
    </header>
  );
};
