export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 animate-pulse">
      {/* Mobile Loading */}
      <div className="lg:hidden">
        <div className="bg-white px-4 py-2 border-b">
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
        <div className="px-4 py-6 bg-gradient-to-br from-gray-100 to-gray-50">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-3" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden">
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-5 w-12 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Loading */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 py-8">
        <div className="h-4 w-48 bg-gray-200 rounded mb-6" />
        <div className="rounded-2xl p-8 bg-gray-100 mb-8">
          <div className="h-12 w-2/3 bg-gray-200 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-5 w-full max-w-3xl bg-gray-200 rounded" />
            <div className="h-5 w-5/6 max-w-2xl bg-gray-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-6 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

