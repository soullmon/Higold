import { Product, ProductMediaItem, MediaItemType } from '../types';

/**
 * Extracts a consolidated, ordered list of all media items (Images, Videos, CAD Dimensions)
 * for a product, ensuring no fragmentation and full backward/forward compatibility.
 */
export function getProductMediaItems(product?: Partial<Product> | null): ProductMediaItem[] {
  if (!product) return [];

  // If explicit mediaList is already provided with items, return it
  if (product.mediaList && Array.isArray(product.mediaList) && product.mediaList.length > 0) {
    return product.mediaList;
  }

  const items: ProductMediaItem[] = [];
  const seenUrls = new Set<string>();

  // 1. Primary Product Image
  if (product.imageUrl && product.imageUrl.trim()) {
    seenUrls.add(product.imageUrl.trim());
    items.push({
      id: 'media-primary-img',
      type: 'image',
      url: product.imageUrl.trim(),
      title: 'Foto Utama Produk',
    });
  }

  // 2. Video Demonstration (Mekanisme & Soft-Close)
  if (product.videoUrl && product.videoUrl.trim()) {
    seenUrls.add(product.videoUrl.trim());
    items.push({
      id: 'media-video-1',
      type: 'video',
      url: product.videoUrl.trim(),
      title: 'Video Gerakan Soft-Close',
    });
  }

  // 3. Additional Gallery Images
  if (product.galleryImages && Array.isArray(product.galleryImages)) {
    product.galleryImages.forEach((img, idx) => {
      const trimmed = img ? img.trim() : '';
      if (trimmed && !seenUrls.has(trimmed)) {
        seenUrls.add(trimmed);
        items.push({
          id: `media-gallery-${idx + 1}`,
          type: 'image',
          url: trimmed,
          title: `Foto Galeri #${idx + 1}`,
        });
      }
    });
  }

  // 4. Dimension / CAD Blueprint Image
  if (product.dimensionImageUrl && product.dimensionImageUrl.trim()) {
    seenUrls.add(product.dimensionImageUrl.trim());
    items.push({
      id: 'media-dimension-1',
      type: 'dimension',
      url: product.dimensionImageUrl.trim(),
      title: 'Skema Dimensi Arsitektural CAD',
    });
  }

  return items;
}

/**
 * Syncs a unified media list back to legacy fields for backward compatibility
 */
export function syncMediaFields(mediaList: ProductMediaItem[]) {
  const images = mediaList.filter(m => m.type === 'image');
  const video = mediaList.find(m => m.type === 'video');
  const dimension = mediaList.find(m => m.type === 'dimension');

  const imageUrl = images.length > 0 ? images[0].url : undefined;
  const galleryImages = images.length > 1 ? images.slice(1).map(m => m.url) : (images.length === 1 ? [images[0].url] : undefined);
  const videoUrl = video ? video.url : undefined;
  const dimensionImageUrl = dimension ? dimension.url : undefined;

  return {
    imageUrl,
    galleryImages,
    videoUrl,
    dimensionImageUrl,
    mediaList: mediaList.length > 0 ? mediaList : undefined,
  };
}
