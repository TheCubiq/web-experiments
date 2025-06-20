// Handles progress display and statistics
export class UIManager {
    constructor(elements) {
        this.elements = elements;
    }

    showProgress() {
        this.elements.progress.style.display = 'block';
    }

    hideProgress() {
        this.elements.progress.style.display = 'none';
    }

    updateProgress(percent, text = null) {
        this.elements.progressFill.style.width = percent + '%';
        if (text) {
            this.elements.progressText.textContent = text;
        } else {
            this.elements.progressText.textContent = `Processing images... ${Math.round(percent)}%`;
        }
    }

    updateBatchInfo(info) {
        this.elements.batchInfo.textContent = info;
    }

    updateStats(stats) {
        this.elements.totalImages.textContent = stats.totalImages;
        this.elements.originalSize.textContent = this.formatSize(stats.originalSize);
        this.elements.compressedSize.textContent = this.formatSize(stats.compressedSize);
        this.elements.compressionRatio.textContent = 
            Math.round((1 - stats.compressedSize / stats.originalSize) * 100) + '%';
        this.elements.processingTime.textContent = stats.processingTime + 'ms';
    }

    showStats() {
        this.elements.stats.style.display = 'grid';
    }

    hideStats() {
        this.elements.stats.style.display = 'none';
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
