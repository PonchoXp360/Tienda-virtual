'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getProductImageUrl } from '@/lib/storage';
import { getPlaceholderImage } from '@/lib/images';

interface ProductImageProps {
  imageId: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
}

export function ProductImage({ imageId, alt, fill, width, height, className, sizes }: ProductImageProps) {
  const minioUrl = getProductImageUrl(imageId);
  const fallbackUrl = getPlaceholderImage(imageId).imageUrl;
  const [src, setSrc] = useState(minioUrl);

  const commonProps = { alt, className, onError: () => setSrc(fallbackUrl) };

  if (fill) {
    return <Image src={src} fill sizes={sizes ?? '100vw'} {...commonProps} />;
  }

  return <Image src={src} width={width ?? 600} height={height ?? 400} {...commonProps} />;
}
