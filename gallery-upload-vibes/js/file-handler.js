// Handles file drag & drop and upload UI
export class FileHandler {
    constructor(elements) {
        this.elements = elements;
        this.isProcessing = false;
        
        this.bindEvents();
    }

    bindEvents() {
        this.elements.dropZone.addEventListener('click', () => {
            if (!this.isProcessing) this.elements.fileInput.click();
        });
        
        this.elements.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        
        this.elements.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!this.isProcessing) this.elements.dropZone.classList.add('dragover');
        });
        
        this.elements.dropZone.addEventListener('dragleave', () => {
            this.elements.dropZone.classList.remove('dragover');
        });
        
        this.elements.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.dropZone.classList.remove('dragover');
            if (!this.isProcessing) this.handleFiles(e.dataTransfer.files);
        });
    }

    async handleFiles(files, onFilesProcessed) {
        if (files.length === 0 || this.isProcessing) return;

        const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (fileArray.length === 0) {
            this.showError('No valid image files selected.');
            return;
        }

        // Warn about large batches on mobile
        if (this.isMobile() && fileArray.length > 30) {
            this.showError(`Warning: Processing ${fileArray.length} images on mobile may cause issues. Consider uploading in smaller batches.`);
        }

        this.setProcessing(true);
        
        try {
            if (onFilesProcessed) {
                await onFilesProcessed(fileArray);
            }
        } catch (error) {
            console.error('Processing error:', error);
            this.showError('Error processing images. Try with fewer images or refresh the page.');
        } finally {
            this.setProcessing(false);
            this.elements.fileInput.value = '';
        }
    }

    setProcessing(processing) {
        this.isProcessing = processing;
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = 'block';
        setTimeout(() => {
            this.elements.errorMessage.style.display = 'none';
        }, 5000);
    }

    updateDropZoneForImages() {
        this.elements.dropZone.classList.add('has-images');
        this.elements.dropZone.querySelector('h3').textContent = 'Drop more images to add them';
    }

    resetDropZone() {
        this.elements.dropZone.classList.remove('has-images');
        this.elements.dropZone.querySelector('h3').textContent = 'Drop images here or click to select';
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}
