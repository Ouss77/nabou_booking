'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ScissorsIcon } from 'lucide-react';
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
        <div className="p-2 bg-amber-500 rounded-full">
          <ScissorsIcon className="w-5 h-5 text-black" />
        </div>
          <span className="text-xl font-bold tracking-tight">Nabou</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden gap-6 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-amber-500">
            Customer
          </Link>
          <Link href="/barbers" className="text-sm font-medium hover:text-amber-500">
            Barber Stores
          </Link>
          <Link href="/admin" className="text-sm font-medium hover:text-amber-500">
            Admin
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav className="flex flex-col items-center gap-4 py-4 md:hidden bg-zinc-950 border-t border-zinc-800">
          <Link href="/" className="text-sm font-medium hover:text-amber-500" onClick={() => setIsOpen(false)}>
            Customer
          </Link>
          <Link href="/barbers" className="text-sm font-medium hover:text-amber-500" onClick={() => setIsOpen(false)}>
            Barber
          </Link>
          <Link href="/admin" className="text-sm font-medium hover:text-amber-500" onClick={() => setIsOpen(false)}>
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
