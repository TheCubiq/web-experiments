// Utility functions for image processing
export class ImageUtils {
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    static isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
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
    }    static async createThumbnail(img, format = null) {
        // Default format if not provided
        if (!format) {
            if (ImageUtils.isIOS()) {
                format = { format: 'image/jpeg', quality: 0.8, extension: 'JPEG' };
            } else {
                format = { format: 'image/webp', quality: 0.8, extension: 'WebP' };
            }
        }

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
                }, format.format, format.quality);
                
            } catch (error) {
                reject(error);
            }
        });
    }
}
