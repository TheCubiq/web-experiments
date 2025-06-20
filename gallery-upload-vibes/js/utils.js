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
    }

    static async createThumbnail(img) {
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
