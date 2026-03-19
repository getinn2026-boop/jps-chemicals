'use client';

import { useState, useEffect, useRef } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
  price: number; // changed from defaultPrice to match API
  currency: string;
}

interface ProductAutocompleteProps {
  name: string;
  placeholder?: string;
  clientId?: string;
  onProductSelect: (product: Product) => void;
}

export default function ProductAutocomplete({ name, placeholder, clientId, onProductSelect }: ProductAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length === 0) {
      setProducts([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        let url = `/api/products/suggestions?q=${encodeURIComponent(query)}`;
        if (clientId) {
          url = `/api/products?clientId=${clientId}&q=${encodeURIComponent(query)}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Handle both API response formats
        const results = data.products || data || [];
        setProducts(results);
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleProductSelect = (product: Product) => {
    setQuery(product.name);
    setIsOpen(false);
    onProductSelect(product);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          name={name}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white pr-10"
          autoComplete="off"
        />
        <BeakerIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading && (
            <div className="px-4 py-3 text-sm text-slate-600">Searching chemicals...</div>
          )}
          
          {!isLoading && products.length === 0 && query.length > 0 && (
            <div className="px-4 py-3 text-sm text-slate-600">No chemicals found starting with "{query}"</div>
          )}

          {!isLoading && products.length > 0 && (
            <div className="py-1">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductSelect(product)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900">{product.name}</div>
                      <div className="text-sm text-slate-600">{product.sku}</div>
                    </div>
                    <div className="text-sm text-slate-500">
                      {product.currency} {product.price}/{product.unit}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}