// Utility functions for image processing
export class ImageUtils {
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static calculateDimensions(width, height, maxSize) {
        if (width <= maxSize && height <= maxSize) {
            return { width, height };
        }
        
        const ratio = Math.min(maxSize / width, maxSize / height);
        return {
            width: Math.round(width * ratio),
            height: Math.round(height * ratio)
        };
    }    static async createThumbnail(img) {
        try {
            // Create a canvas to resize the image first
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const size = 200; // Slightly larger for better quality
            canvas.width = size;
            canvas.height = size;
            
            const scale = Math.max(size / img.width, size / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (size - scaledWidth) / 2;
            const y = (size - scaledHeight) / 2;
            
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            
            // Convert canvas to blob
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/webp', 0.8);
            });
            
            // Create a file from the blob
            const thumbnailFile = new File([blob], 'thumbnail.webp', { type: 'image/webp' });
            
            // Use browser-image-compression for further optimization
            const compressionOptions = {
                maxSizeMB: 0.05, // Very small for thumbnails
                maxWidthOrHeight: 200,
                useWebWorker: true,
                fileType: 'image/webp',
                initialQuality: 0.7
            };
            
            const compressedThumbnail = await imageCompression(thumbnailFile, compressionOptions);
            return URL.createObjectURL(compressedThumbnail);
            
        } catch (error) {
            console.error('Error creating thumbnail:', error);
            // Fallback to original method if compression fails
            return this.createThumbnailFallback(img);
        }
    }

    // Fallback method for thumbnail creation
    static async createThumbnailFallback(img) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const size = 160;
                canvas.width = size;
                canvas.height = size;
                
                const scale = Math.max(size / img.width, size / img.height);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const x = (size - scaledWidth) / 2;
                const y = (size - scaledHeight) / 2;
                
                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(URL.createObjectURL(blob));
                    } else {
                        reject(new Error('Failed to create thumbnail'));
                    }
                }, 'image/webp', 0.8);
                
            } catch (error) {
                reject(error);
            }
        });
    }
}
