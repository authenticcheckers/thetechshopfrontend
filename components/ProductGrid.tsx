import React, { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  rating?: number;
  reviewsCount?: number;
  category?: string;
  brand?: string;
};

export default function ProductGrid({ products, onAdd }: { products: Product[]; onAdd?: (p: Product) => void }) {
  // client side controls
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating'>('relevance');
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const perPage = 12;

  // collect unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    (products || []).forEach(p => p.category && set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let out = products || [];
    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(p => (p.name + ' ' + (p.description || '') + ' ' + (p.brand || '')).toLowerCase().includes(q));
    }
    // category
    if (category !== 'all') out = out.filter(p => p.category === category);
    // sort
    if (sort === 'price-asc') out = out.slice().sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') out = out.slice().sort((a, b) => b.price - a.price);
    if (sort === 'rating') out = out.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return out;
  }, [products, query, sort, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search products, brands, specs..."
            className="w-full bg-neutral-800 rounded-lg p-3 outline-none"
          />
          <select value={sort} onChange={e => setSort(e.target.value as any)} className="bg-neutral-800 rounded-lg p-3">
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        <div className="w-64 bg-neutral-800 rounded-lg p-3">
          <label className="block text-sm text-neutral-400 mb-2">Category</label>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="w-full bg-neutral-900 rounded-md p-2">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pageItems.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
      </div>

      <div className="mt-8">
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
