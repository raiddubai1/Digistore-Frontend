export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse h-full flex flex-col">
      {/* Image Skeleton - Square on Mobile, 4:3 on Desktop */}
      <div className="aspect-square lg:aspect-[4/3] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 relative">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 lg:p-5 space-y-3 flex-1 flex flex-col">
        {/* Category */}
        <div className="h-3 w-20 bg-gray-200 rounded"></div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-12 w-12 lg:h-11 lg:w-11 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

