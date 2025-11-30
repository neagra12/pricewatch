'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
  currentPrice?: number;
  prices: Array<{
    retailer: string;
    price: number;
    url: string;
    inStock: boolean;
  }>;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'LAPTOP');

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    const searchCategory = searchParams.get('category');

    if (searchQuery && searchCategory) {
      performSearch(searchQuery, searchCategory);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string, searchCategory: string) => {
    setLoading(true);
    setError(null);

    try {
      const scrapeResponse = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category: searchCategory, 
          query: searchQuery 
        }),
      });

      if (!scrapeResponse.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await scrapeResponse.json();
      console.log('Received data:', data);
      
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&category=${category}`);
    }
  };

  const getLowestPrice = (product: Product) => {
    if (product.currentPrice) return product.currentPrice;
    if (!product.prices || product.prices.length === 0) return null;
    return Math.min(...product.prices.map(p => p.price));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">PriceWatch</h1>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent outline-none"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700"
                >
                  <option value="LAPTOP">Laptops</option>
                  <option value="HEADPHONE">Headphones</option>
                  <option value="MONITOR">Monitors</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Search results for "{searchParams.get('q')}"
          </h2>
          <p className="text-gray-600 mt-1">
            {loading ? 'Searching...' : `${products.length} products found`}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Searching retailers...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found. Try a different search term.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const lowestPrice = getLowestPrice(product);
              
              return (
                <Link 
                  href={`/products/${product.id}`} 
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                >
                  {product.imageUrl && (
                    <div className="aspect-square mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {product.brand}
                    </p>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mt-1">
                      {product.name}
                    </h3>
                  </div>

                  {lowestPrice && lowestPrice > 0 ? (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ${lowestPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          at {product.prices?.length || 0} retailer{(product.prices?.length || 0) > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">In Stock</p>
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-gray-400">Price not available</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}