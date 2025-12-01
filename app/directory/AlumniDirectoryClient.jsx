"use client";

import React, { useState, useMemo } from "react";
import { CldImage } from "next-cloudinary";
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  Check,
  Quote,
  Heart,
  School,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function AlumniDirectoryClient({
  initialAlumni = [],
  initialError = null,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const hasAnyAlumni = initialAlumni && initialAlumni.length > 0;

  const filteredAlumni = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return initialAlumni;

    return initialAlumni.filter((alum) => {
      const name = alum.fullName?.toLowerCase() || "";
      const org = alum.organization?.toLowerCase() || "";
      const blood = alum.bloodGroup?.toLowerCase() || "";
      const city = alum.currentCity?.toLowerCase() || "";
      const job = alum.jobTitle?.toLowerCase() || "";

      return (
        name.includes(term) ||
        org.includes(term) ||
        blood.includes(term) ||
        city.includes(term) ||
        job.includes(term)
      );
    });
  }, [initialAlumni, searchTerm]);

  const handleCopy = async (text, id) => {
    if (!text) return;
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      console.warn("Clipboard API not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success(`${text} copied`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:py-8 sm:px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200">
          <div className="w-full md:w-auto text-center md:text-left">
            <School className="md:hidden sm:inline w-10 h-10 text-center mx-auto sm:w-8 sm:h-8 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-2 sm:gap-3">
              <School className="hidden md:inline w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              বাঁশগ্রাম হাইস্কুল অ্যালামনাই ডিরেক্টরি
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {initialError
                ? "There was a problem loading the directory."
                : hasAnyAlumni
                ? `Found ${filteredAlumni.length} senior${
                    filteredAlumni.length === 1 ? "" : "s"
                  } ready to help`
                : "No alumni registered yet. Be the first to join!"}
            </p>
          </div>

          <div className="relative w-full md:w-80 lg:w-96">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, company, city, or blood group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Error state */}
        {initialError && (
          <div className="text-center py-12 sm:py-20">
            <p className="text-red-500 font-semibold mb-2 text-sm sm:text-base">
              {initialError}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Please check your database / API and try again.
            </p>
          </div>
        )}

        {/* No alumni at all */}
        {!initialError && !hasAnyAlumni && (
          <div className="text-center py-12 sm:py-20 opacity-70">
            <p className="text-lg sm:text-xl font-bold text-gray-500">
              No alumni have registered yet.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Once seniors start registering, they will appear here
              automatically.
            </p>
          </div>
        )}

        {/* No search results but we HAVE alumni */}
        {!initialError && hasAnyAlumni && filteredAlumni.length === 0 && (
          <div className="text-center py-12 sm:py-20 opacity-60">
            <p className="text-lg sm:text-xl font-bold text-gray-400">
              No alumni found matching &quot;{searchTerm}&quot;
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-3 sm:mt-4 text-red-500 hover:underline text-sm sm:text-base"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Directory grid */}
        {!initialError && filteredAlumni.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAlumni.map((alum) => (
              <div
                key={alum._id}
                className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-lg sm:hover:shadow-xl hover:border-red-200 transition-all duration-300 relative overflow-hidden flex flex-col"
              >
                {/* Gradient Top Stripe */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Mobile Layout: Image First */}
                <div className="block sm:hidden">
                  {/* Large Profile Image for Mobile */}
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative mb-3">
                      <div className="relative">
                        {/* Background gradient ring */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm group-hover:blur-0"></div>

                        {/* Large Profile image container for mobile */}
                        <div className="relative w-25 h-25 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-red-200 transition-all duration-300 bg-white">
                          {alum.photo ? (
                            <CldImage
                              src={alum.photo}
                              width={120}
                              height={120}
                              alt={`Profile photo of ${alum.fullName}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              crop="fill"
                              gravity="faces"
                              quality="auto"
                              format="auto"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <User className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Online indicator dot */}
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>

                    {/* Name and Contact Info for Mobile */}
                    <div className="text-center w-full">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {alum.fullName}
                      </h3>

                      {/* Mobile Contact Buttons */}
                      <div className="flex justify-center gap-3 mt-2">
                        {alum.phone && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(alum.phone, `phone-${alum._id}`)
                            }
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                                ${
                                  copiedId === `phone-${alum._id}`
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600"
                                }`}
                          >
                            {copiedId === `phone-${alum._id}` ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Phone className="w-3 h-3" />
                            )}
                            {copiedId === `phone-${alum._id}`
                              ? "Copied"
                              : "Call"}
                          </button>
                        )}

                        {alum.email && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(alum.email, `email-${alum._id}`)
                            }
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                                ${
                                  copiedId === `email-${alum._id}`
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600"
                                }`}
                          >
                            {copiedId === `email-${alum._id}` ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Mail className="w-3 h-3" />
                            )}
                            {copiedId === `email-${alum._id}`
                              ? "Copied"
                              : "Email"}
                          </button>
                        )}
                        <div className="">
                          {alum.bloodGroup && (
                            <div className="flex flex-col items-end gap-1">
                              <span className="px-2.5 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 text-xs font-bold rounded-full flex items-center gap-1 border border-red-100 shadow-sm">
                                <Heart className="w-3 h-3 fill-current" />
                                {alum.bloodGroup}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout: Original Side-by-Side */}
                <div className="hidden sm:flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    {/* Enhanced Profile Photo Container for Desktop */}
                    <div className="relative shrink-0">
                      <div className="relative">
                        {/* Background gradient ring */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm group-hover:blur-0"></div>

                        {/* Profile image container for desktop */}
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 group-hover:border-red-200 transition-all duration-300 bg-white">
                          {alum.photo ? (
                            <CldImage
                              src={alum.photo}
                              width={64}
                              height={64}
                              alt={`Profile photo of ${alum.fullName}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              crop="fill"
                              gravity="faces"
                              quality="auto"
                              format="auto"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <User className="w-7 h-7 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Online indicator dot */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>

                    {/* Name and Batch Info for Desktop */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                        {alum.fullName}
                      </h3>
                      {alum.passingYear && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <GraduationCap className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            Batch of {alum.passingYear}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Blood Group badge */}
                  {alum.bloodGroup && (
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 text-xs font-bold rounded-full flex items-center gap-1 border border-red-100 shadow-sm">
                        <Heart className="w-3 h-3 fill-current" />
                        {alum.bloodGroup}
                      </span>
                    </div>
                  )}
                </div>

                {/* Job & Location Info - Shared */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {(alum.jobTitle || alum.organization) && (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm text-gray-700">
                      <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {alum.jobTitle && (
                        <span className="font-semibold text-xs sm:text-sm truncate">
                          {alum.jobTitle}
                        </span>
                      )}
                      {alum.jobTitle && alum.organization && (
                        <span className="text-gray-400 text-xs">at</span>
                      )}
                      {alum.organization && (
                        <span className="font-semibold text-xs sm:text-sm truncate">
                          {alum.organization}
                        </span>
                      )}
                    </div>
                  )}

                  {alum.currentCity && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{alum.currentCity}</span>
                    </div>
                  )}
                </div>

                {/* Quote with enhanced design */}
                {alum.quote && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 relative italic text-gray-600 text-xs sm:text-sm border-l-2 border-red-200">
                    <Quote className="absolute top-2 left-2 w-3 h-3 sm:w-4 sm:h-4 text-red-300 -scale-x-100 opacity-70" />
                    <p className="pl-4 sm:pl-5 line-clamp-3 leading-relaxed">
                      &quot;{alum.quote}&quot;
                    </p>
                  </div>
                )}

                {/* Action Buttons - Desktop Only */}
                <div className="hidden sm:grid mt-auto border-t border-gray-100 pt-4 grid-cols-2 gap-3">
                  {/* Phone Button */}
                  {alum.phone && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(alum.phone, `phone-${alum._id}`)
                      }
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                          ${
                            copiedId === `phone-${alum._id}`
                              ? "bg-green-100 text-green-700 shadow-inner"
                              : "bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
                          }`}
                    >
                      {copiedId === `phone-${alum._id}` ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                      {copiedId === `phone-${alum._id}` ? "Copied" : "Call"}
                    </button>
                  )}

                  {/* Email Button */}
                  {alum.email && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(alum.email, `email-${alum._id}`)
                      }
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                          ${
                            copiedId === `email-${alum._id}`
                              ? "bg-green-100 text-green-700 shadow-inner"
                              : "bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
                          }`}
                    >
                      {copiedId === `email-${alum._id}` ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                      {copiedId === `email-${alum._id}` ? "Copied" : "Email"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
