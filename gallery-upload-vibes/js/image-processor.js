import { ImageUtils } from './utils.js';

// Handles image optimization and batch processing using browser-image-compression
export class ImageProcessor {    constructor() {
        this.batchSize = ImageUtils.isMobile() ? 5 : 10; // Smaller batches on mobile
        
        // Default settings
        this.settings = {
            quality: 0.8, // 80%
            format: 'image/webp',
            maxSizeMB: 1,
            maxWidthOrHeight: 1920
        };
    }
    
    // Update compression settings
    updateSettings(quality, format) {
        this.settings.quality = quality / 100; // Convert percentage to decimal
        this.settings.format = format;
        
        // Adjust max size based on format
        switch (format) {
            case 'image/webp':
                this.settings.maxSizeMB = 1;
                break;
            case 'image/jpeg':
                this.settings.maxSizeMB = 1.5;
                break;
            case 'image/png':
                this.settings.maxSizeMB = 3; // PNG is larger
                break;
        }
    }
    
    // Get current compression options
    getCompressionOptions() {
        return {
            maxSizeMB: this.settings.maxSizeMB,
            maxWidthOrHeight: this.settings.maxWidthOrHeight,
            useWebWorker: true,
            fileType: this.settings.format,
            initialQuality: this.settings.quality,
            alwaysKeepResolution: false
        };
    }
    
    // Get thumbnail compression options
    getThumbnailOptions() {
        return {
            maxSizeMB: 0.05,
            maxWidthOrHeight: 200,
            useWebWorker: true,
            fileType: 'image/webp', // Always use WebP for thumbnails for efficiency
            initialQuality: 0.7,
            alwaysKeepResolution: false
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
    }    async optimizeImage(file) {
        try {
            // Use browser-image-compression for the main optimization
            const compressionOptions = this.getCompressionOptions();
            const compressedFile = await imageCompression(file, compressionOptions);
            
            // Create URLs for the compressed image
            const url = URL.createObjectURL(compressedFile);
            
            // Create an image element to get dimensions
            const img = await this.loadImage(url);
            
            // Create thumbnail using browser-image-compression
            const thumbnailUrl = await this.createOptimizedThumbnail(file);
            
            // Get file extension for display
            const formatName = this.getFormatName(this.settings.format);
            
            return {
                id: Date.now() + Math.random(),
                name: file.name,
                originalSize: file.size,
                compressedSize: compressedFile.size,
                url: url,
                thumbnailUrl: thumbnailUrl,
                width: img.width,
                height: img.height,
                type: formatName
            };
            
        } catch (error) {
            console.error(`Error optimizing ${file.name}:`, error);
            throw error;
        }
    }
    
    // Create optimized thumbnail using browser-image-compression
    async createOptimizedThumbnail(file) {
        try {
            const thumbnailOptions = this.getThumbnailOptions();
            const compressedThumbnail = await imageCompression(file, thumbnailOptions);
            return URL.createObjectURL(compressedThumbnail);
        } catch (error) {
            console.error('Error creating optimized thumbnail:', error);
            // Fallback to utility method
            const img = await this.loadImage(URL.createObjectURL(file));
            return await ImageUtils.createThumbnailFallback(img);
        }
    }
    
    // Get format display name
    getFormatName(mimeType) {
        switch (mimeType) {
            case 'image/webp': return 'WebP';
            case 'image/jpeg': return 'JPEG';
            case 'image/png': return 'PNG';
            default: return 'WebP';
        }
    }
    
    // Helper method to load image and get dimensions
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    }
}
