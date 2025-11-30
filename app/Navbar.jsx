"use client";
import React, { useState } from "react";
import Link from "next/link";
import { School, Menu, X, Users, UserPlus, Home } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Define navigation links
  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Directory", href: "/directory", icon: Users },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white  backdrop-blur-md border-b border-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600  hover:text-red-600  transition-colors flex items-center gap-2"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600  hover:bg-gray-100  rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white  border-b border-gray-100 ">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700  hover:bg-red-50  hover:text-red-600 rounded-xl transition-colors"
            >
              <link.icon className="w-5 h-5 opacity-70" />
              {link.name}
            </Link>
          ))}

          {/* <div className="pt-2">
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full py-3 bg-red-500 text-white font-bold rounded-xl active:scale-95 transition-transform"
            >
              Join Network Now
            </Link>
          </div> */}
        </div>
      </div>
    </nav>
  );
}
