import Image from 'next/image';
import type { RecommendedProduct } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface RecommendedProductCardProps {
  product: RecommendedProduct;
}

export function RecommendedProductCard({ product }: RecommendedProductCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="block overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={400}
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-1 text-base font-semibold leading-tight">
          <span className="hover:text-primary">{product.name}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
      </CardFooter>
    </Card>
  );
}
