import { useEffect } from 'react';
import { GALLERY_IMAGES, prefetchImages } from '../data/gallery-assets';

const GalleryPrefetch = () => {
  useEffect(() => {
    // Start prefetching after a short delay to ensure initial page load is prioritized
    const timeoutId = setTimeout(() => {
      prefetchImages(GALLERY_IMAGES);
    }, 2000); // 2-second delay

    return () => clearTimeout(timeoutId);
  }, []);

  return null; // This component doesn't render anything
};

export default GalleryPrefetch;
