"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import Image from "next/image";
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
  MessageCircle,
  X,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Users,
  Building2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

// Blood group list for quick filtering
const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Helper to get initials
function getInitials(name) {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Consistent avatar gradient based on name
function getAvatarGradient(name) {
  const gradients = [
    "from-red-500 to-amber-500",
    "from-rose-500 to-red-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
  ];
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// Normalize phone to international format for WhatsApp
function getWhatsAppUrl(phone) {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "");
  // If Bangladeshi format 01XXXXXXXXX, prepend 88
  let formatted = digits;
  if (digits.startsWith("01") && digits.length === 11) {
    formatted = "88" + digits;
  }
  return `https://wa.me/${formatted}`;
}

export default function AlumniDirectoryClient({
  initialAlumni = [],
  initialError = null,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);

  const [selectedBlood, setSelectedBlood] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'batch-desc', 'batch-asc', 'name'
  const [copiedId, setCopiedId] = useState(null);
  const [activeModalAlumni, setActiveModalAlumni] = useState(null);
  const [displayCount, setDisplayCount] = useState(18);

  const hasAnyAlumni = initialAlumni && initialAlumni.length > 0;

  // Extract unique batches from data
  const availableBatches = useMemo(() => {
    if (!hasAnyAlumni) return [];
    const set = new Set();
    initialAlumni.forEach((a) => {
      if (a.passingYear) set.add(String(a.passingYear));
    });
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [initialAlumni, hasAnyAlumni]);

  // Extract stats
  const stats = useMemo(() => {
    if (!hasAnyAlumni) return { total: 0, batches: 0, donors: 0, cities: 0 };
    const batchSet = new Set();
    const citySet = new Set();
    let donorsCount = 0;

    initialAlumni.forEach((a) => {
      if (a.passingYear) batchSet.add(String(a.passingYear));
      if (a.currentCity) citySet.add(a.currentCity.trim().toLowerCase());
      if (a.bloodGroup) donorsCount++;
    });

    return {
      total: initialAlumni.length,
      batches: batchSet.size,
      donors: donorsCount,
      cities: citySet.size,
    };
  }, [initialAlumni, hasAnyAlumni]);

  // Filtered & sorted alumni list
  const filteredAlumni = useMemo(() => {
    if (!hasAnyAlumni) return [];

    const term = deferredSearch.trim().toLowerCase();

    const matches = initialAlumni.filter((alum) => {
      // Blood group filter
      if (
        selectedBlood !== "All" &&
        alum.bloodGroup?.toUpperCase() !== selectedBlood.toUpperCase()
      ) {
        return false;
      }

      // Batch filter
      if (
        selectedBatch !== "All" &&
        String(alum.passingYear) !== String(selectedBatch)
      ) {
        return false;
      }

      // Search term
      if (!term) return true;

      const name = alum.fullName?.toLowerCase() || "";
      const org = alum.organization?.toLowerCase() || "";
      const blood = alum.bloodGroup?.toLowerCase() || "";
      const city = alum.currentCity?.toLowerCase() || "";
      const job = alum.jobTitle?.toLowerCase() || "";
      const year = String(alum.passingYear || "").toLowerCase();

      return (
        name.includes(term) ||
        org.includes(term) ||
        blood.includes(term) ||
        city.includes(term) ||
        job.includes(term) ||
        year.includes(term)
      );
    });

    // Sort
    return matches.sort((a, b) => {
      if (sortBy === "batch-desc") {
        return (Number(b.passingYear) || 0) - (Number(a.passingYear) || 0);
      }
      if (sortBy === "batch-asc") {
        return (Number(a.passingYear) || 0) - (Number(b.passingYear) || 0);
      }
      if (sortBy === "name") {
        return (a.fullName || "").localeCompare(b.fullName || "");
      }
      // 'newest' default
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [
    initialAlumni,
    hasAnyAlumni,
    deferredSearch,
    selectedBlood,
    selectedBatch,
    sortBy,
  ]);

  // Slice for virtualized pagination/load more
  const paginatedAlumni = useMemo(() => {
    return filteredAlumni.slice(0, displayCount);
  }, [filteredAlumni, displayCount]);

  const handleCopy = async (text, id, label = "তথ্য") => {
    if (!text) return;
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("ক্লিপবোর্ড সেবা সমর্থন করছে না");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success(`${label} কপি হয়েছে!`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("কপি করতে সমস্যা হয়েছে");
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedBlood("All");
    setSelectedBatch("All");
    setSortBy("newest");
    setDisplayCount(18);
  };

  const isFilteringActive =
    searchTerm.trim() !== "" ||
    selectedBlood !== "All" ||
    selectedBatch !== "All" ||
    sortBy !== "newest";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-4 px-3 sm:py-8 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Main Header Card */}
        <div className="relative bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/80 overflow-hidden">
          {/* Subtle decorative gradient background */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                <School className="w-3.5 h-3.5" />
                <span>বাঁশগ্রাম উচ্চ বিদ্যালয় অ্যালামনাই ডিরেক্টরি</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                প্রাক্তন শিক্ষার্থীদের নেটওয়ার্ক
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl">
                সকল ব্যাচের সিনিয়র ও জুনিয়রদের সাথে সহজে যোগাযোগ করুন, রক্তদান
                সহায়তা নিন এবং পারস্পরিক সম্পর্ক সুদৃঢ় করুন।
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="নাম, প্রতিষ্ঠান, শহর, রক্তের গ্রুপ বা ব্যাচ..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setDisplayCount(18);
                  }}
                  className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl sm:rounded-2xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-xs"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md"
                    title="মুছুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        {hasAnyAlumni && !initialError && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-gray-900">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  নিবন্ধিত অ্যালামনাই
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-gray-900">
                  {stats.batches}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  পাসের ব্যাচ
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-gray-900">
                  {stats.donors}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  রক্তদাতা প্রস্তুত
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-gray-900">
                  {stats.cities}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  বিভিন্ন শহর
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Sort Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Blood group pills */}
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                <span>রক্তের গ্রুপ অনুযায়ী খুঁজুন:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {BLOOD_GROUPS.map((bg) => {
                  const active = selectedBlood === bg;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => {
                        setSelectedBlood(bg);
                        setDisplayCount(18);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        active
                          ? "bg-red-500 text-white shadow-xs scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200/80"
                      }`}
                    >
                      {bg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Batch & Sort Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
              {/* Batch Select */}
              {availableBatches.length > 0 && (
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedBatch}
                    onChange={(e) => {
                      setSelectedBatch(e.target.value);
                      setDisplayCount(18);
                    }}
                    className="bg-transparent text-xs sm:text-sm font-semibold text-gray-700 outline-none cursor-pointer"
                  >
                    <option value="All">সকল ব্যাচ</option>
                    {availableBatches.map((b) => (
                      <option key={b} value={b}>
                        ব্যাচ {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort Select */}
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-gray-700 outline-none cursor-pointer"
                >
                  <option value="newest">সর্বশেষ যুক্ত</option>
                  <option value="batch-desc">ব্যাচ (সিনিয়র আগে)</option>
                  <option value="batch-asc">ব্যাচ (জুনিয়র আগে)</option>
                  <option value="name">নাম (A-Z)</option>
                </select>
              </div>

              {/* Reset filter button if active */}
              {isFilteringActive && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
                >
                  রিসেট ফিল্টার
                </button>
              )}
            </div>
          </div>

          {/* Results Counter & Emergency Blood Banner */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-xs sm:text-sm text-gray-500 font-medium">
              {filteredAlumni.length > 0 ? (
                <>
                  মোট <span className="font-bold text-gray-900">{filteredAlumni.length}</span> জন
                  অ্যালামনাই পাওয়া গেছে{" "}
                  {selectedBlood !== "All" && (
                    <span className="text-red-600 font-semibold">({selectedBlood} রক্তের গ্রুপ)</span>
                  )}
                </>
              ) : (
                "কোন অ্যালামনাই মেলেনি"
              )}
            </div>

            {selectedBlood !== "All" && filteredAlumni.length > 0 && (
              <div className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-lg border border-red-200 font-semibold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-red-500" />
                জরুরী প্রয়োজনে সরাসরি কল করুন অথবা WhatsApp এ বার্তা পাঠান
              </div>
            )}
          </div>
        </div>

        {/* Error state */}
        {initialError && (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-red-200 p-6">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <X className="w-6 h-6" />
            </div>
            <p className="text-red-600 font-bold mb-1 text-base">{initialError}</p>
            <p className="text-gray-500 text-sm">
              ডাটাবেসের সাথে যোগাযোগ করা যাচ্ছে না। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।
            </p>
          </div>
        )}

        {/* Empty State: No alumni registered yet */}
        {!initialError && !hasAnyAlumni && (
          <div className="text-center py-16 sm:py-24 bg-white rounded-3xl border border-gray-200/80 p-8">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              এখনও কোনো অ্যালামনাই নিবন্ধিত হননি
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              আপনিই হোন বাঁশগ্রাম উচ্চ বিদ্যালয়ের প্রথম নিবন্ধিত অ্যালামনাই! আপনার
              তথ্য দিয়ে ডিরেক্টরি সমৃদ্ধ করুন।
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-xs"
            >
              এখনই রেজিস্ট্রেশন করুন
            </a>
          </div>
        )}

        {/* Empty State: No search/filter match */}
        {!initialError && hasAnyAlumni && filteredAlumni.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/80 p-8">
            <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
              কোনো ফলাফল পাওয়া যায়নি
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">
              &quot;{searchTerm || selectedBlood}&quot; অনুযায়ী কোনো সদস্য পাওয়া যায়নি।
              অন্য কোনো নাম বা ফিল্টার চেষ্টা করুন।
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}

        {/* Directory Grid */}
        {!initialError && filteredAlumni.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedAlumni.map((alum) => {
              const waUrl = getWhatsAppUrl(alum.phone);
              const initials = getInitials(alum.fullName);
              const gradient = getAvatarGradient(alum.fullName);

              return (
                <div
                  key={alum._id}
                  className="group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-red-300 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Top gradient glow line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Header: Photo + Name + Batch */}
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      {/* Photo / Avatar */}
                      <div
                        onClick={() => setActiveModalAlumni(alum)}
                        className="relative shrink-0 cursor-pointer"
                        title="সম্পূর্ণ প্রোফাইল দেখুন"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-gray-200 group-hover:border-red-300 transition-all duration-300 bg-gray-100 shadow-xs relative">
                          {alum.photo ? (
                            <img
                              src={alum.photo}
                              alt={alum.fullName}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                // Fallback to initials if image URL fails
                                e.currentTarget.style.display = "none";
                                const fallback = e.currentTarget.nextElementSibling;
                                if (fallback) fallback.classList.remove("hidden");
                              }}
                            />
                          ) : null}

                          <div
                            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-inner ${
                              alum.photo ? "hidden" : "flex"
                            }`}
                          >
                            {initials}
                          </div>
                        </div>

                        {/* Blood group indicator pin */}
                        {alum.bloodGroup && (
                          <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-md shadow-xs border border-white flex items-center gap-0.5">
                            <Heart className="w-2.5 h-2.5 fill-current" />
                            {alum.bloodGroup}
                          </div>
                        )}
                      </div>

                      {/* Name & Batch */}
                      <div className="flex-1 min-w-0">
                        <h3
                          onClick={() => setActiveModalAlumni(alum)}
                          className="text-base sm:text-lg font-black text-gray-900 group-hover:text-red-600 transition-colors truncate cursor-pointer leading-tight"
                          title={alum.fullName}
                        >
                          {alum.fullName}
                        </h3>

                        {alum.passingYear && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-md bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/60">
                            <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                            <span>ব্যাচ {alum.passingYear}</span>
                          </div>
                        )}

                        {alum.currentCity && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{alum.currentCity}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Professional Info */}
                    <div className="space-y-1.5 mb-4 text-xs sm:text-sm">
                      {(alum.jobTitle || alum.organization) && (
                        <div className="flex items-start gap-2 text-gray-700 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                          <Briefcase className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1 leading-snug">
                            {alum.jobTitle && (
                              <span className="font-bold text-gray-900">
                                {alum.jobTitle}
                              </span>
                            )}
                            {alum.jobTitle && alum.organization && (
                              <span className="text-gray-400 mx-1">|</span>
                            )}
                            {alum.organization && (
                              <span className="text-gray-600">
                                {alum.organization}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quote (if present) */}
                    {alum.quote && (
                      <div className="bg-gradient-to-br from-red-50/40 to-orange-50/40 rounded-xl p-3 mb-4 text-xs text-gray-600 italic border-l-2 border-red-300 relative">
                        <Quote className="w-3 h-3 text-red-300 inline mr-1 -scale-x-100" />
                        <span className="line-clamp-2 leading-relaxed">
                          &quot;{alum.quote}&quot;
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Call, WhatsApp, Email */}
                  <div className="pt-3 border-t border-gray-100 mt-auto">
                    <div className="grid grid-cols-3 gap-2">
                      {/* Call Button */}
                      {alum.phone ? (
                        <a
                          href={`tel:${alum.phone}`}
                          onClick={(e) => {
                            // Also copy on long-term tap
                            handleCopy(alum.phone, `phone-${alum._id}`, "ফোন নম্বর");
                          }}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                            copiedId === `phone-${alum._id}`
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-gray-200/80"
                          }`}
                          title="কল করুন / ট্যাপ করে কপি করুন"
                        >
                          {copiedId === `phone-${alum._id}` ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Phone className="w-3.5 h-3.5 text-red-500" />
                          )}
                          <span>কল</span>
                        </a>
                      ) : (
                        <div className="opacity-40 py-2 text-center text-xs text-gray-400 border border-gray-100 rounded-xl">
                          কল নেই
                        </div>
                      )}

                      {/* WhatsApp Button */}
                      {waUrl ? (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors"
                          title="WhatsApp এ বার্তা পাঠান"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                          <span>হোয়াটসঅ্যাপ</span>
                        </a>
                      ) : (
                        <div className="opacity-40 py-2 text-center text-xs text-gray-400 border border-gray-100 rounded-xl">
                          চ্যাট নেই
                        </div>
                      )}

                      {/* Email Button */}
                      {alum.email ? (
                        <a
                          href={`mailto:${alum.email}`}
                          onClick={() => {
                            handleCopy(alum.email, `email-${alum._id}`, "ইমেইল");
                          }}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                            copiedId === `email-${alum._id}`
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-gray-200/80"
                          }`}
                          title="ইমেইল পাঠান / কপি করুন"
                        >
                          {copiedId === `email-${alum._id}` ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Mail className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span>মেইল</span>
                        </a>
                      ) : (
                        <div className="opacity-40 py-2 text-center text-xs text-gray-400 border border-gray-100 rounded-xl">
                          মেইল নেই
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Pagination Button */}
        {!initialError && filteredAlumni.length > displayCount && (
          <div className="text-center pt-4">
            <button
              onClick={() => setDisplayCount((prev) => prev + 18)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 font-bold rounded-2xl shadow-xs hover:shadow-md transition-all active:scale-95 text-sm"
            >
              <span>আরও দেখুন ({filteredAlumni.length - displayCount} জন বাকি)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Full Details Modal */}
        {activeModalAlumni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveModalAlumni(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-red-200 shadow-sm shrink-0 bg-gray-100 relative">
                  {activeModalAlumni.photo ? (
                    <img
                      src={activeModalAlumni.photo}
                      alt={activeModalAlumni.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${getAvatarGradient(
                        activeModalAlumni.fullName
                      )} flex items-center justify-center text-white font-black text-2xl`}
                    >
                      {getInitials(activeModalAlumni.fullName)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                    {activeModalAlumni.fullName}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    {activeModalAlumni.passingYear && (
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                        ব্যাচ {activeModalAlumni.passingYear}
                      </span>
                    )}
                    {activeModalAlumni.bloodGroup && (
                      <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-200 flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-current" />
                        রক্তের গ্রুপ: {activeModalAlumni.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Details List */}
              <div className="space-y-3.5 text-sm bg-gray-50 p-4 sm:p-5 rounded-2xl mb-6 border border-gray-100">
                <div className="flex items-start gap-3 text-gray-700">
                  <Briefcase className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">
                      {activeModalAlumni.jobTitle}
                    </span>
                    <span className="text-xs text-gray-500">
                      {activeModalAlumni.organization}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span>বর্তমান শহর: <strong className="text-gray-900">{activeModalAlumni.currentCity}</strong></span>
                </div>

                <div className="flex items-center justify-between gap-3 text-gray-700 pt-2 border-t border-gray-200/60">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{activeModalAlumni.phone}</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(activeModalAlumni.phone, "modal-phone", "ফোন নম্বর")
                    }
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    কপি করুন
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 text-gray-700 pt-2 border-t border-gray-200/60">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="truncate max-w-[200px]">{activeModalAlumni.email}</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(activeModalAlumni.email, "modal-email", "ইমেইল")
                    }
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    কপি করুন
                  </button>
                </div>
              </div>

              {/* Quote */}
              {activeModalAlumni.quote && (
                <div className="bg-red-50/50 p-4 rounded-2xl border-l-4 border-red-500 text-sm text-gray-700 italic mb-6">
                  &quot;{activeModalAlumni.quote}&quot;
                </div>
              )}

              {/* Modal Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${activeModalAlumni.phone}`}
                  className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-center text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  সরাসরি কল করুন
                </a>

                {getWhatsAppUrl(activeModalAlumni.phone) ? (
                  <a
                    href={getWhatsAppUrl(activeModalAlumni.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-center text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    হোয়াটসঅ্যাপে চ্যাট
                  </a>
                ) : (
                  <a
                    href={`mailto:${activeModalAlumni.email}`}
                    className="py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-center text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Mail className="w-4 h-4" />
                    ইমেইল পাঠান
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
