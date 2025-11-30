"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, User, Info, BookOpen, Briefcase, MapPin, Phone, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AlumniRegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("দয়া করে একটি বৈধ ছবির ফাইল নির্বাচন করুন (JPEG, PNG, WebP)");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("ফাইলের সাইজ 2MB এর কম হতে হবে");
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removePhoto = () => {
    setPreviewUrl("");
    const fileInput = document.getElementById('photo');
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

      const fileInput = document.getElementById('photo');
      if (fileInput.files[0]) {
        submitData.append('photo', fileInput.files[0]);
      }

      const response = await fetch('/api/alumni', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "রেজিস্ট্রেশন সফল হয়েছে!");
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
        toast.error(result.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("নেটওয়ার্ক ত্রুটি। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl my-10 mx-auto bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
      {/* Header Section with Instructions */}
      <div className="bg-linear-to-r from-red-50 to-orange-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-red-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
          বাঁশগ্রাম হাইস্কুল এলামনাই ডিরেক্টরিতে যোগ দিন
        </h2>
        
        <div className="space-y-2 md:space-y-0 md:grid md:grid-cols-2 gap-3 md:gap-4 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <span className="text-xs md:text-sm">তারকাচিহ্নিত (*) ফিল্ডগুলি অবশ্যই পূরণ করতে হবে</span>
          </div>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <span className="text-xs md:text-sm">সকল তথ্য সঠিক এবং আপ-টু-ডেট থাকা প্রয়োজন</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Photo Upload Section */}
        <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <User className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            প্রোফাইল ছবি
          </h3>
          <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
            <div className="shrink-0 self-center sm:self-start">
              <div className="relative">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl object-cover border-2 border-red-200"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <User className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-grow w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                প্রোফাইল ছবি (ঐচ্ছিক)
              </label>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label
                    htmlFor="photo"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer hover:bg-red-100 transition-colors text-sm font-semibold w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4" />
                    ছবি আপলোড
                  </label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="text-xs md:text-sm text-gray-500 text-center sm:text-left">JPEG, PNG, WebP (সর্বোচ্চ 2MB)</span>
                </div>
                <p className="text-xs text-gray-500">
                  একটি পেশাদার প্রোফাইল ছবি আপনাকে সহজে চেনাতে সাহায্য করবে। 
                  পরিষ্কার এবং সাম্প্রতিক ছবি ব্যবহার করার চেষ্টা করুন।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <User className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            ব্যক্তিগত তথ্য
          </h3>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                পুরো নাম *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="আপনার পুরো নাম লিখুন"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">আপনার পুরো নাম ব্যবহার করুন</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                ইমেইল *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="example@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">সক্রিয় ইমেইল ঠিকানা দিন</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                ফোন নম্বর *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="01XXXXXXXXX"
                pattern="[0-9]{11}"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">বাংলাদেশী ফোন নম্বর ফরম্যাটে দিন (11 ডিজিট)</p>
            </div>

            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                রক্তের গ্রুপ *
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
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
              <p className="text-xs text-gray-500 mt-1">জরুরী অবস্থায় সাহায্যের জন্য</p>
            </div>
          </div>
        </div>

        {/* Location & Education Section */}
        <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            অবস্থান ও শিক্ষা
          </h3>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            <div>
              <label htmlFor="currentCity" className="block text-sm font-medium text-gray-700 mb-1">
                বর্তমান শহর *
              </label>
              <input
                type="text"
                id="currentCity"
                name="currentCity"
                value={formData.currentCity}
                onChange={handleInputChange}
                required
                placeholder="আপনার বর্তমান ঠিকানা"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">যে শহরে/গ্রামে আপনি বর্তমানে থাকেন</p>
            </div>

            <div>
              <label htmlFor="passingYear" className="block text-sm font-medium text-gray-700 mb-1">
                পাস করার বছর *
              </label>
              <input
                type="number"
                id="passingYear"
                name="passingYear"
                value={formData.passingYear}
                onChange={handleInputChange}
                min="1950"
                max="2030"
                required
                placeholder="২০১৬"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">যে বছর আপনি SSC পাস করেছেন</p>
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            পেশাগত তথ্য
          </h3>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                পদবী *
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
                placeholder="উদাহরণ: ছাত্র, শিক্ষক, ব্যবসায়ী বা ইঞ্জিনিয়ার"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">আপনার বর্তমান পদবী</p>
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                প্রতিষ্ঠান *
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
                placeholder="আপনার কর্মস্থল/শিক্ষা প্রতিষ্ঠানের নাম"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">আপনার বর্তমান কর্মস্থল/কোম্পানি/শিক্ষা প্রতিষ্ঠান</p>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
            প্রিয় উক্তি (ঐচ্ছিক)
          </h3>
          <div>
            <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">
              আপনার প্রিয় একটি উক্তি শেয়ার করুন
            </label>
            <textarea
              id="quote"
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              rows={3}
              placeholder="জীবনকে অনুপ্রাণিত করে এমন একটি উক্তি লিখুন..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none text-sm md:text-base"
            />
            <p className="text-xs text-gray-500 mt-1">
              এটি আপনার প্রোফাইলকে আরও ব্যক্তিগত এবং আকর্ষণীয় করবে
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-green-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-green-200">
          <div className="text-center">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              রেজিস্ট্রেশন সম্পন্ন করুন
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mb-4">
              সকল তথ্য সঠিকভাবে পূরণ হয়েছে কিনা যাচাই করুন। সাবমিট করার পর আপনার তথ্য আমাদের ডাটাবেসে সংরক্ষিত হবে।
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 md:hover:scale-105 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  রেজিস্ট্রেশন করা হচ্ছে...
                </>
              ) : (
                "এলামনাই ডিরেক্টরিতে যোগ দিন"
              )}
            </button>
            
            {/* Environment Warning */}
            {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">ছবি আপলোড সার্ভিস বর্তমানে unavailable। আপনি এখনও রেজিস্ট্রেশন করতে পারেন।</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}