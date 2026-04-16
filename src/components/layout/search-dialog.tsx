'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { searchProducts } from '@/lib/actions/products';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/images';
import { Search, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchProducts(debouncedQuery).then((res) => {
      if (!cancelled) {
        setResults(res);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const handleSelect = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0">
        <div className="flex items-center border-b px-4">
          {loading ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-muted-foreground" />
          )}
          <Input
            placeholder="Busca teclados, monitores, etc."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 w-full border-0 shadow-none focus-visible:ring-0 text-base"
          />
        </div>
        <ScrollArea className="max-h-[60vh]">
          <div className="p-4">
            {results.length > 0 ? (
              <ul className="space-y-4">
                {results.map((product) => {
                  const image = getPlaceholderImage(product.imageId);
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/producto/${product.id}`}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
                        onClick={handleSelect}
                      >
                        <Image
                          src={image.imageUrl}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="rounded-md h-12 w-12 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              debouncedQuery.trim().length > 1 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No se encontraron productos para &ldquo;{debouncedQuery}&rdquo;</p>
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
