'use client';

import { useState, useEffect } from 'react';
import type { Product, RecommendedProduct } from '@/lib/types';
import { getProductRecommendations } from '@/ai/flows/ai-product-recommendations';
import { RecommendedProductCard } from './recommended-product-card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductRecommendationsProps {
  product: Product;
}

export function ProductRecommendations({ product }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);
        const result = await getProductRecommendations({
          productName: product.name,
          productDescription: product.description,
          productCategory: product.category,
          productPrice: product.price,
        });
        setRecommendations(result.recommendations);
      } catch (e) {
        console.error('Failed to get AI recommendations:', e);
        setError('No pudimos cargar las recomendaciones en este momento.');
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [product]);

  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-8">
        También te podría interesar
      </h2>
      
      {loading && (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
             </div>
          ))}
        </div>
      )}

      {error && <p className="text-destructive">{error}</p>}
      
      {!loading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {recommendations.map((rec) => (
            <RecommendedProductCard key={rec.id} product={rec} />
          ))}
        </div>
      )}
    </section>
  );
}
