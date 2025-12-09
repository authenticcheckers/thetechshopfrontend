import React from 'react';

export default function Pagination({ page, setPage, totalPages }: { page: number; setPage: (n: number) => void; totalPages: number }) {
  const prev = () => setPage(Math.max(1, page - 1));
  const next = () => setPage(Math.min(totalPages, page + 1));
  return (
    <div className="flex items-center justify-center gap-3">
      <button onClick={prev} disabled={page === 1} className="px-3 py-1 rounded bg-neutral-800 disabled:opacity-50">Prev</button>
      <span className="px-3 py-1 bg-neutral-900 rounded">Page {page} / {totalPages}</span>
      <button onClick={next} disabled={page === totalPages} className="px-3 py-1 rounded bg-neutral-800 disabled:opacity-50">Next</button>
    </div>
  );
}
