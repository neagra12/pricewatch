'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  const lowestPrice = product.prices.length > 0 
    ? Math.min(...product.prices.map((p: any) => p.price))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4">
        <Link href="/" className="text-blue-600">Back to Home</Link>
      </header>
      <main className="max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg">
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.brand}</p>
            <div className="text-4xl font-bold text-blue-600 mb-8">${lowestPrice.toFixed(2)}</div>
            <h2 className="text-xl font-semibold mb-4">Available at:</h2>
            {product.prices.map((price: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-white p-4 mb-3 rounded border">
                <div>
                  <p className="font-semibold">{price.retailer}</p>
                  <p className="text-sm">{price.inStock ? 'In Stock' : 'Out of Stock'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">${price.price.toFixed(2)}</span>
                  <a href={price.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded">
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}