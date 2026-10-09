"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  X,
  User,
  Info,
  BookOpen,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  School,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

export default function AlumniRegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    currentCity: "",
    passingYear: "",
    jobTitle: "",
    organization: "",
    quote: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("দয়া করে একটি বৈধ ছবির ফাইল নির্বাচন করুন (JPEG, PNG, WebP)");
        return;
      }

      if (file.size > 3 * 1024 * 1024) {
        toast.error("ফাইলের সাইজ 3MB এর কম হতে হবে");
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removePhoto = () => {
    setPreviewUrl("");
    const fileInput = document.getElementById("photo");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });

      const fileInput = document.getElementById("photo");
      if (fileInput && fileInput.files[0]) {
        submitData.append("photo", fileInput.files[0]);
      }

      const response = await fetch("/api/alumni", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "রেজিস্ট্রেশন সফল হয়েছে!");
        setIsSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          bloodGroup: "",
          currentCity: "",
          passingYear: "",
          jobTitle: "",
          organization: "",
          quote: "",
        });
        removePhoto();
        router.refresh();
      } else {
        toast.error(
          result.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।"
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("নেটওয়ার্ক ত্রুটি। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl my-6 sm:my-10 mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-amber-500 rounded-3xl p-6 sm:p-10 mb-6 sm:mb-8 text-white shadow-lg overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-semibold">
              <School className="w-3.5 h-3.5" />
              <span>বাঁশগ্রাম উচ্চ বিদ্যালয় অ্যালামনাই নেটওয়ার্ক</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              অ্যালামনাই ডিরেক্টরিতে যোগ দিন
            </h1>
            <p className="text-red-100 text-sm sm:text-base max-w-xl">
              আপনার ব্যাচমেট ও প্রিয় স্কুলের সকল প্রাক্তন শিক্ষার্থীদের সাথে
              যুক্ত হোন। জরুরি রক্তের প্রয়োজনে একে অপরের পাশে দাঁড়ান।
            </p>
          </div>

          <Link
            href="/directory"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-red-600 font-bold text-sm shadow-md hover:bg-red-50 hover:scale-105 active:scale-95 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>ডিরেক্টরি দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Success Banner */}
      {isSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 mb-8 text-emerald-900 shadow-xs animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-emerald-950">
                অভিনন্দন! আপনার রেজিস্ট্রেশন সফল হয়েছে।
              </h3>
              <p className="text-sm text-emerald-700 mt-1">
                আপনার তথ্য সফলভাবে ডিরেক্টরিতে যোগ করা হয়েছে। আপনি এখন অ্যালামনাই তালিকায় উপস্থিত আছেন।
              </p>
            </div>
            <Link
              href="/directory"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shrink-0"
            >
              ডিরেক্টরিতে নিজের নাম দেখুন &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Main Registration Form Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-5 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Photo Upload Section */}
          <div className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-red-600" />
              প্রোফাইল ছবি
            </h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative shrink-0">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-red-300 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-xs transition-colors"
                      title="ছবি মুছুন"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-white text-gray-400">
                    <User className="w-8 h-8 text-gray-300" />
                    <span className="text-[10px] mt-1 font-medium">ছবি নেই</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <label
                  htmlFor="photo"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl cursor-pointer font-bold text-xs sm:text-sm border border-red-200 transition-colors shadow-2xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>ছবি নির্বাচন করুন</span>
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500">
                  সর্বোচ্চ 3MB (JPEG, PNG, WebP)। একটি পরিষ্কার ও সাম্প্রতিক ছবি নির্বাচন করুন।
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <User className="w-5 h-5 text-red-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                ব্যক্তিগত তথ্য
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  পুরো নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  ইমেইল ঠিকানা <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="example@mail.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  ফোন / হোয়াটসঅ্যাপ নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="bloodGroup"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  রক্তের গ্রুপ <span className="text-red-500">*</span>
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm cursor-pointer"
                >
                  <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Education & Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <MapPin className="w-5 h-5 text-red-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                অবস্থান ও শিক্ষা
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="passingYear"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  পাস করার বছর (ব্যাচ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="passingYear"
                  name="passingYear"
                  value={formData.passingYear}
                  onChange={handleInputChange}
                  min="1960"
                  max="2035"
                  required
                  placeholder="যেমন: 2016"
                  className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="currentCity"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  বর্তমান শহর / ঠিকানা <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="currentCity"
                  name="currentCity"
                  value={formData.currentCity}
                  onChange={handleInputChange}
                  required
                  placeholder="যেমন: ঢাকা, চট্টগ্রাম, বা বাঁশগ্রাম"
                  className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Professional Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Briefcase className="w-5 h-5 text-red-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                পেশাগত তথ্য
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="jobTitle"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  পদবী / পেশা <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="যেমন: সফটওয়্যার প্রকৌশলী, শিক্ষার্থী, শিক্ষক"
                  className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="organization"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  প্রতিষ্ঠান / বিশ্ববিদ্যালয় <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  required
                  placeholder="আপনার কর্মস্থল বা শিক্ষা প্রতিষ্ঠানের নাম"
                  className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Quote (Optional) */}
          <div className="space-y-2">
            <label
              htmlFor="quote"
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              প্রিয় উক্তি বা স্কুলের স্মৃতি (ঐচ্ছিক)
            </label>
            <textarea
              id="quote"
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              rows={3}
              placeholder="জীবন বা প্রিয় বিদ্যালয় সম্পর্কে আপনার একটি প্রিয় বাণী..."
              className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-2xl font-black text-base shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>তথ্য জমা দেওয়া হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>রেজিস্ট্রেশন সম্পন্ন করুন</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2.5">
              সকল তথ্য সুরক্ষিত থাকবে এবং শুধুমাত্র প্রাক্তন শিক্ষার্থীদের যোগাযোগে ব্যবহৃত হবে।
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
