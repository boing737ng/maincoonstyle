export default function Loading() {
  return (
    <div className="container-site py-16">
      <div className="max-w-3xl space-y-4">
        <div className="stitch h-8 w-40 animate-pulse bg-card/40" />
        <div className="h-10 w-2/3 animate-pulse rounded-md bg-card/60" />
        <div className="h-4 w-1/2 animate-pulse rounded-md bg-card/40" />
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="photo-frame"
          >
            <div className="aspect-[4/5] w-full animate-pulse bg-card-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
