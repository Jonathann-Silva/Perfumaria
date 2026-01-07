import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export function getImageById(id: string): ImagePlaceholder | undefined {
  return placeholderImages.find((img) => img.id === id);
}
