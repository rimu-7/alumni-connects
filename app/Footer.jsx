"use client";

import React from "react";
import Link from "next/link";
import { School, Heart } from "lucide-react";

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="p-2 bg-red-100 rounded-xl text-red-600  group-hover:scale-110 transition-transform duration-200">
                <School className="w-6 h-6" />
              </div>
              <span className="font-black text-xl text-gray-900  tracking-tight">
                Alumni<span className="text-red-500">Connect</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>&copy; {currentYear}</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>Banshgram highschool Alumni</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
