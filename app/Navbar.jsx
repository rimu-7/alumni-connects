"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { School, Menu, X, Users, Home, UserPlus } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "হোম (রেজিস্ট্রেশন)", href: "/", icon: Home },
    { name: "অ্যালামনাই ডিরেক্টরি", href: "/directory", icon: Users },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <School className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl text-gray-900 tracking-tight leading-none">
                Alumni<span className="text-red-500">Connect</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                বাঁশগ্রাম উচ্চ বিদ্যালয়
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? "bg-red-50 text-red-600 shadow-xs"
                      : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-red-600" : "text-gray-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-gray-100 bg-white ${
          isOpen ? "max-h-60 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="px-4 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                  active
                    ? "bg-red-50 text-red-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-red-600" : "text-gray-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
