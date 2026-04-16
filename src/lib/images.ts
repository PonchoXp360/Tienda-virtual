import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

const imageMap = new Map<string, ImagePlaceholder>(
  placeholderImages.map((img) => [img.id, img])
);

export function getPlaceholderImage(id: string): ImagePlaceholder {
  const image = imageMap.get(id);
  if (!image) {
    // Return a default or throw an error
    const defaultImage = imageMap.get('hero-background');
    if (defaultImage) return defaultImage;
    throw new Error(`Placeholder image with id "${id}" not found.`);
  }
  return image;
}
