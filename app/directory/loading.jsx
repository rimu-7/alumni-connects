import React from "react";

export default function DirectoryLoading() {
  return (
    <div className="min-h-screen bg-gray-50/70 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-pulse">
        {/* Header & Search Skeleton */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs border border-gray-200/80 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="w-full md:w-auto space-y-2 text-center md:text-left">
            <div className="h-7 sm:h-8 w-64 sm:w-80 bg-gray-200 rounded-lg mx-auto md:mx-0" />
            <div className="h-4 w-48 sm:w-60 bg-gray-100 rounded-md mx-auto md:mx-0" />
          </div>

          {/* Search box placeholder */}
          <div className="w-full md:w-80 lg:w-96">
            <div className="h-11 sm:h-12 w-full bg-gray-100 rounded-xl border border-gray-200" />
          </div>
        </div>

        {/* Stats Strip Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-4 w-12 bg-gray-200 rounded-md" />
                <div className="h-3 w-20 bg-gray-100 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Filter Pills Skeleton */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-28 bg-gray-200 rounded-md" />
            <div className="h-4 w-16 bg-gray-100 rounded-md" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-14 sm:w-16 bg-gray-100 rounded-full border border-gray-200"
              />
            ))}
          </div>
        </div>

        {/* Alumni Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start gap-4">
                {/* Avatar Skeleton */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-200 shrink-0" />

                <div className="flex-1 min-w-0 space-y-2 pt-1">
                  <div className="h-5 w-32 bg-gray-200 rounded-md" />
                  <div className="h-4 w-24 bg-gray-100 rounded-md" />
                  <div className="h-4 w-16 bg-red-100 rounded-full" />
                </div>
              </div>

              {/* Occupation & Location */}
              <div className="space-y-2 py-2">
                <div className="h-4 w-3/4 bg-gray-100 rounded-md" />
                <div className="h-4 w-1/2 bg-gray-100 rounded-md" />
              </div>

              {/* Quote box placeholder */}
              <div className="h-14 bg-gray-50 rounded-xl border border-gray-100 p-2 space-y-1.5">
                <div className="h-3 w-4/5 bg-gray-200 rounded-md" />
                <div className="h-3 w-3/5 bg-gray-200 rounded-md" />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-gray-100">
                <div className="h-10 bg-gray-100 rounded-xl" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
