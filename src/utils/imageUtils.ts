/**
 * Compresses an image file using Canvas to stay under a target size (default 100kb).
 * Converts the image to WebP for maximum efficiency.
 */
export const compressImage = async (
    file: File, 
    maxWidth = 1200, 
    quality = 0.8,
    targetSizeBytes = 100 * 1024
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Scale down if exceeds maxWidth
                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("Failed to get canvas context"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Start with requested quality, then decrease if still over target size
                const attemptCompression = (q: number) => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error("Canvas toBlob failed"));
                                return;
                            }
                            // If still too big and quality is above 0.1, try again with lower quality
                            if (blob.size > targetSizeBytes && q > 0.1) {
                                attemptCompression(q - 0.1);
                            } else {
                                resolve(blob);
                            }
                        },
                        'image/webp',
                        q
                    );
                };

                attemptCompression(quality);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
