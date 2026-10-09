import React from "react";
import Link from "next/link";
import { School, Heart, Users, ArrowUpRight } from "lucide-react";

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform"
            >
              <div className="p-2 bg-red-100 rounded-xl text-red-600 group-hover:scale-105 transition-transform duration-200">
                <School className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="font-black text-lg sm:text-xl text-gray-900 tracking-tight">
                Alumni<span className="text-red-500">Connect</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block text-xs bg-red-50 text-red-600 font-semibold px-2.5 py-0.5 rounded-full border border-red-100">
              Banshgram High School
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              রেজিস্ট্রেশন
            </Link>
            <Link
              href="/directory"
              className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <Users className="w-4 h-4" />
              ডিরেক্টরি
            </Link>
          </div>

          {/* Copyright & Credit */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <span>&copy; {currentYear}</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" />
            <span>বাঁশগ্রাম হাইস্কুল অ্যালামনাই অ্যাসোসিয়েশন</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
