'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('LAPTOP');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&category=${category}`);
    }
  };

  const popularSearches = [
    { term: 'gaming laptop', category: 'LAPTOP' },
    { term: 'macbook', category: 'LAPTOP' },
    { term: 'sony headphones', category: 'HEADPHONE' },
    { term: 'airpods', category: 'HEADPHONE' },
    { term: '4k monitor', category: 'MONITOR' },
    { term: 'ultrawide monitor', category: 'MONITOR' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PriceWatch</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              How it Works
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Categories
            </a>
            <a href="/test" className="text-gray-600 hover:text-gray-900 transition-colors">
              Admin
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find the Best Deals on
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Electronics
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compare prices across retailers for laptops, headphones, and monitors. 
            Track price history and never overpay again.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for laptops, headphones, monitors..."
                className="flex-1 outline-none text-lg py-3"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border-l border-gray-200 outline-none text-gray-700 bg-transparent cursor-pointer"
            >
              <option value="LAPTOP">Laptops</option>
              <option value="HEADPHONE">Headphones</option>
              <option value="MONITOR">Monitors</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Popular Searches */}
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-sm text-gray-500 mb-3 text-center">Popular searches:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(search.term);
                  setCategory(search.category);
                  router.push(`/search?q=${encodeURIComponent(search.term)}&category=${search.category}`);
                }}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                {search.term}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Price Comparison</h3>
            <p className="text-gray-600">
              Compare prices across multiple retailers to find the best deal
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Price History</h3>
            <p className="text-gray-600">
              Track price trends over time and buy at the perfect moment
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Price Alerts</h3>
            <p className="text-gray-600">
              Get notified when prices drop on products you're watching
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2024 PriceWatch. Built for finding the best electronics deals.</p>
        </div>
      </footer>
    </div>
  );
}