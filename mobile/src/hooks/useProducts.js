import { useMemo } from 'react';

export function getHealthColor(score) {
  if (score >= 70) return '#10B981';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}

export function useFilteredProducts(products, searchQuery, healthFilter) {
  return useMemo(() => {
    const q = (searchQuery || '').toLowerCase();
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      const matchesHealthFilter = healthFilter === 'all' ||
        (healthFilter === 'good' && p.score >= 70) ||
        (healthFilter === 'moderate' && p.score >= 40 && p.score < 70) ||
        (healthFilter === 'poor' && p.score < 40);

      return matchesSearch && matchesHealthFilter;
    });
  }, [products, searchQuery, healthFilter]);
}

export default useFilteredProducts;
