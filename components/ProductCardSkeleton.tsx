export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="h-4 w-24 bg-gray-200 rounded"></div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Rating & Downloads */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

