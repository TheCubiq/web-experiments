import { ImageProcessor } from './image-processor.js';
import { Gallery } from './gallery.js';
import { FileHandler } from './file-handler.js';
import { UIManager } from './ui-manager.js';
import { ImageUtils } from './utils.js';

// Main application class that coordinates all modules
export class ImageOptimizer {    constructor() {
        this.images = [];
        this.totalOriginalSize = 0;
        this.totalCompressedSize = 0;
        this.startTime = 0;
        
        this.initializeElements();
        this.initializeModules();
        this.bindEvents();
        this.initializeCompressionSettings();
    }

    initializeElements() {
        this.elements = {
            dropZone: document.getElementById('dropZone'),
            fileInput: document.getElementById('fileInput'),
            progress: document.getElementById('progress'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            batchInfo: document.getElementById('batchInfo'),
            errorMessage: document.getElementById('errorMessage'),
            stats: document.getElementById('stats'),
            gallery: document.getElementById('gallery'),
            currentImage: document.getElementById('currentImage'),
            imageInfo: document.getElementById('imageInfo'),
            thumbnailStrip: document.getElementById('thumbnailStrip'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            resetBtn: document.getElementById('resetBtn'),
            imageCounter: document.getElementById('imageCounter'),
            
            // Compression controls
            qualitySlider: document.getElementById('qualitySlider'),
            qualityValue: document.getElementById('qualityValue'),
            formatSelect: document.getElementById('formatSelect'),
            
            // Stats elements
            totalImages: document.getElementById('totalImages'),
            originalSize: document.getElementById('originalSize'),
            compressedSize: document.getElementById('compressedSize'),
            compressionRatio: document.getElementById('compressionRatio'),
            processingTime: document.getElementById('processingTime')
        };
    }

    initializeModules() {
        this.imageProcessor = new ImageProcessor();
        this.gallery = new Gallery(this.elements);
        this.fileHandler = new FileHandler(this.elements);
        this.uiManager = new UIManager(this.elements);
    }    bindEvents() {
        this.elements.resetBtn.addEventListener('click', () => this.reset());
        
        // Quality slider event
        this.elements.qualitySlider.addEventListener('input', (e) => {
            const quality = parseInt(e.target.value);
            this.elements.qualityValue.textContent = `${quality}%`;
            this.updateCompressionSettings();
        });
        
        // Format selection event
        this.elements.formatSelect.addEventListener('change', () => {
            this.updateCompressionSettings();
        });
        
        // Set up file handler callback
        this.fileHandler.handleFiles = this.fileHandler.handleFiles.bind(this.fileHandler);
        const originalHandleFiles = this.fileHandler.handleFiles;
        this.fileHandler.handleFiles = async (files) => {
            await originalHandleFiles(files, this.processFiles.bind(this));
        };
    }
    
    updateCompressionSettings() {
        const quality = parseInt(this.elements.qualitySlider.value);
        const format = this.elements.formatSelect.value;
        this.imageProcessor.updateSettings(quality, format);
        
        // Update the drop zone text to reflect current settings
        const formatName = this.imageProcessor.getFormatName(format);
        const dropText = this.elements.dropZone.querySelector('p');
        if (dropText) {
            dropText.textContent = `Supports JPG, PNG, GIF - Will optimize to ${formatName} (${quality}% quality)`;
        }
    }
    
    initializeCompressionSettings() {
        // Set initial values and update the processor
        this.updateCompressionSettings();
    }

    async processFiles(fileArray) {
        this.startTime = performance.now();
        this.uiManager.showProgress();
        
        try {
            const newImages = await this.imageProcessor.processBatches(
                fileArray,
                (progress) => this.uiManager.updateProgress(progress),
                (batchInfo) => this.uiManager.updateBatchInfo(batchInfo)
            );
            
            // Add new images to existing collection
            this.images.push(...newImages);
            
            // Update totals
            newImages.forEach(image => {
                this.totalOriginalSize += image.originalSize;
                this.totalCompressedSize += image.compressedSize;
            });
            
            this.showResults();
            
        } finally {
            this.uiManager.hideProgress();
        }
    }

    showResults() {
        if (this.images.length === 0) return;

        const processingTime = Math.round(performance.now() - this.startTime);
        
        // Update file handler UI
        this.fileHandler.updateDropZoneForImages();
        
        // Update stats
        this.uiManager.updateStats({
            totalImages: this.images.length,
            originalSize: this.totalOriginalSize,
            compressedSize: this.totalCompressedSize,
            processingTime: processingTime
        });

        this.uiManager.showStats();        // Setup gallery with remove callback
        this.gallery.setImages([...this.images]); // Pass a copy to avoid reference issues
        
        // Override the gallery's removeImage method to handle stats updates
        const originalRemoveImage = this.gallery.removeImage.bind(this.gallery);
        this.gallery.removeImage = (index) => {
            if (index < 0 || index >= this.images.length) return;
            
            const removedImage = this.images[index];
            
            // Update our totals
            this.totalOriginalSize -= removedImage.originalSize;
            this.totalCompressedSize -= removedImage.compressedSize;
            
            // Remove from our array too
            this.images.splice(index, 1);
            
            // Call the original method which handles UI updates
            const result = originalRemoveImage(index);
            
            if (result && result.allRemoved) {
                this.reset();
            } else {
                // Update stats after removal
                this.uiManager.updateStats({
                    totalImages: this.images.length,
                    originalSize: this.totalOriginalSize,
                    compressedSize: this.totalCompressedSize,
                    processingTime: Math.round(performance.now() - this.startTime)
                });
            }
        };
        
        this.gallery.show();
    }

    reset() {
        this.images.forEach(image => {
            URL.revokeObjectURL(image.url);
            URL.revokeObjectURL(image.thumbnailUrl);
        });
        this.images = [];
        this.totalOriginalSize = 0;
        this.totalCompressedSize = 0;
        
        this.uiManager.hideStats();
        this.gallery.hide();
        this.fileHandler.resetDropZone();
        this.elements.fileInput.value = '';
    }
}
