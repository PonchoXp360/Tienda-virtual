'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/images';
import { Search } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (open) {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const searchResults = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);
  
  const handleSelect = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0">
        <div className="flex items-center border-b px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
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
                        {results.map(product => {
                            const image = getPlaceholderImage(product.imageId);
                            return (
                                <li key={product.id}>
                                    <Link href={`/producto/${product.id}`} className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent" onClick={handleSelect}>
                                        <Image src={image.imageUrl} alt={product.name} width={48} height={48} className="rounded-md h-12 w-12 object-cover"/>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                                        </div>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    query.trim().length > 1 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No se encontraron productos para "{query}"</p>
                        </div>
                    )
                )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
