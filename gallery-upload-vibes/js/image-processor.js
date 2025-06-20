import { ImageUtils } from './utils.js';

// Handles image optimization and batch processing
export class ImageProcessor {
    constructor() {
        this.batchSize = ImageUtils.isMobile() ? 5 : 10; // Smaller batches on mobile
        this.webpSupported = null; // Will be set after detection
        this.init();
    }

    async init() {
        this.webpSupported = await this.detectWebPSupport();
    }

    // Detect WebP support in the browser
    async detectWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Get the best supported format and quality
    getOptimalFormat() {
        // For iOS devices that don't support WebP, use JPEG
        if (ImageUtils.isIOS() && !this.webpSupported) {
            return {
                format: 'image/jpeg',
                quality: 0.85,
                extension: 'JPEG'
            };
        }
        
        // For other browsers, prefer WebP
        return {
            format: 'image/webp',
            quality: 0.85,
            extension: 'WebP'
        };
    }

    async processBatches(files, progressCallback, batchInfoCallback) {
        const totalBatches = Math.ceil(files.length / this.batchSize);
        let processedCount = 0;
        const results = [];
        
        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const start = batchIndex * this.batchSize;
            const end = Math.min(start + this.batchSize, files.length);
            const batch = files.slice(start, end);
            
            batchInfoCallback(`Processing batch ${batchIndex + 1} of ${totalBatches} (${batch.length} images)`);
            
            // Process batch
            const batchResults = await this.processBatch(batch, processedCount, files.length, progressCallback);
            
            // Add to main array
            results.push(...batchResults);
            
            processedCount += batch.length;
            
            // Update progress
            progressCallback((processedCount / files.length) * 100);
            
            // Small delay to prevent browser freezing
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Garbage collection hint
            if (window.gc) window.gc();
        }
        
        return results;
    }

    async processBatch(files, startIndex, totalFiles, progressCallback) {
        const batchResults = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            try {
                const optimizedImage = await this.optimizeImage(file);
                batchResults.push(optimizedImage);
                
                // Update progress within batch
                const overallProgress = ((startIndex + i + 1) / totalFiles) * 100;
                progressCallback(overallProgress);
                
            } catch (error) {
                console.error(`Error optimizing ${file.name}:`, error);
                // Continue with other images
            }
        }
        
        return batchResults;
    }

    async optimizeImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = async () => {
                try {
                    // Create main optimized image
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    let { width, height } = ImageUtils.calculateDimensions(img.width, img.height, 1920);
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                      const format = this.getOptimalFormat();
                    
                    canvas.toBlob(async (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to create blob'));
                            return;
                        }
                        
                        const url = URL.createObjectURL(blob);
                        
                        // Create thumbnail with the same format
                        const thumbnailUrl = await ImageUtils.createThumbnail(img, format);
                        
                        resolve({
                            id: Date.now() + Math.random(),
                            name: file.name,
                            originalSize: file.size,
                            compressedSize: blob.size,
                            url: url,
                            thumbnailUrl: thumbnailUrl,
                            width: width,
                            height: height,
                            type: format.extension
                        });
                    }, format.format, format.quality);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
            img.src = URL.createObjectURL(file);
        });
    }
}
