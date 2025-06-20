// Handles the image gallery display and navigation
export class Gallery {
    constructor(elements) {
        this.elements = elements;
        this.images = [];
        this.currentIndex = 0;
        
        this.bindEvents();
    }

    bindEvents() {
        this.elements.prevBtn.addEventListener('click', () => this.previousImage());
        this.elements.nextBtn.addEventListener('click', () => this.nextImage());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.images.length > 0) {
                if (e.key === 'ArrowLeft') this.previousImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });
    }

    setImages(images) {
        this.images = images;
        this.currentIndex = Math.min(this.currentIndex, images.length - 1);
        this.createThumbnails();
        this.showImage(this.currentIndex);
    }

    createThumbnails() {
        this.elements.thumbnailStrip.innerHTML = '';
        this.images.forEach((image, index) => {
            const container = document.createElement('div');
            container.className = 'thumbnail-container';
            
            const thumb = document.createElement('img');
            thumb.src = image.thumbnailUrl;
            thumb.className = 'thumbnail';
            thumb.addEventListener('click', () => this.showImage(index));
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeImage(index);
            });
            
            container.appendChild(thumb);
            container.appendChild(removeBtn);
            this.elements.thumbnailStrip.appendChild(container);
        });
    }    removeImage(index) {
        if (index < 0 || index >= this.images.length) return;
        
        const image = this.images[index];
        
        URL.revokeObjectURL(image.url);
        URL.revokeObjectURL(image.thumbnailUrl);
        
        this.images.splice(index, 1);
        
        if (this.images.length === 0) {
            return { removedImage: image, allRemoved: true };
        }
        
        if (this.currentIndex >= this.images.length) {
            this.currentIndex = this.images.length - 1;
        } else if (this.currentIndex > index) {
            this.currentIndex--;
        }
        
        this.createThumbnails();
        this.showImage(this.currentIndex);
        
        return { removedImage: image, allRemoved: false };
    }

    showImage(index) {
        if (index < 0 || index >= this.images.length) return;
        
        this.currentIndex = index;
        const image = this.images[index];
        
        this.elements.currentImage.src = image.url;
        this.elements.imageCounter.textContent = `${index + 1} / ${this.images.length}`;
        
        this.elements.imageInfo.innerHTML = `
            <strong>${image.name}</strong><br>
            ${image.width} × ${image.height}<br>
            Original: ${this.formatSize(image.originalSize)}<br>
            Compressed: ${this.formatSize(image.compressedSize)} (${image.type})<br>
            Saved: ${Math.round((1 - image.compressedSize / image.originalSize) * 100)}%
        `;

        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        this.elements.prevBtn.disabled = index === 0;
        this.elements.nextBtn.disabled = index === this.images.length - 1;
    }

    previousImage() {
        if (this.currentIndex > 0) {
            this.showImage(this.currentIndex - 1);
        }
    }

    nextImage() {
        if (this.currentIndex < this.images.length - 1) {
            this.showImage(this.currentIndex + 1);
        }
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    show() {
        this.elements.gallery.style.display = 'block';
    }

    hide() {
        this.elements.gallery.style.display = 'none';
    }
}
