import React from "react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[80vh] py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-36 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100 flex flex-col items-center justify-center space-y-3 p-6">
          <div className="w-12 h-12 bg-red-200/70 rounded-full" />
          <div className="h-6 w-72 bg-red-200/60 rounded-md" />
          <div className="h-4 w-48 bg-red-100 rounded-md" />
        </div>

        {/* Form Card Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-xs">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="h-5 w-36 bg-gray-200 rounded-md" />
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl border border-dashed border-gray-300" />
              <div className="space-y-2 flex-1">
                <div className="h-9 w-36 bg-gray-200 rounded-lg" />
                <div className="h-3 w-48 bg-gray-100 rounded-md" />
              </div>
            </div>
          </div>

          {/* Section 2: Input fields */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="h-5 w-32 bg-gray-200 rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded-md" />
                <div className="h-10 w-full bg-gray-100 rounded-lg border border-gray-200" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded-md" />
                <div className="h-10 w-full bg-gray-100 rounded-lg border border-gray-200" />
              </div>
            </div>
          </div>

          {/* Button skeleton */}
          <div className="pt-4">
            <div className="h-12 w-full bg-red-400/40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}