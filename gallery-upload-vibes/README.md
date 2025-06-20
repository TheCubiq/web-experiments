# Image Gallery Optimizer

A modern web application for optimizing and viewing image galleries with WebP compression using the browser-image-compression library.

## Features

- **Advanced Compression**: Uses browser-image-compression library for superior image optimization
- **WebP Output**: Converts images to WebP format for maximum compression
- **Batch Processing**: Handles multiple images efficiently with progress tracking
- **Mobile Optimized**: Adaptive batch sizes for mobile devices
- **Real-time Preview**: View optimized images with before/after comparisons

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start local server**:
   ```bash
   npm start
   ```
   Or manually:
   ```bash
   npx http-server -p 3000
   ```

3. **Open in browser**: Navigate to `http://localhost:3000`

## File Structure

```
vibes-gallery-viewer/
├── package.json          # Project dependencies
├── index.html              # Main HTML file
├── style.css              # All styles
├── app.js                 # Application entry point
├── js/
│   ├── main.js           # Main ImageOptimizer class
│   ├── image-processor.js # Image optimization with browser-image-compression
│   ├── gallery.js        # Gallery display and navigation
│   ├── file-handler.js   # File drag & drop handling
│   ├── ui-manager.js     # Progress and stats UI management
│   └── utils.js          # Utility functions
└── README.md             # This file
```

## Module Overview

### `main.js` - ImageOptimizer
The main application class that coordinates all modules and manages the overall application state.

### `image-processor.js` - ImageProcessor  
Handles image optimization, WebP conversion, and batch processing to prevent browser freezing.

### `gallery.js` - Gallery
Manages the image gallery display, navigation, thumbnail creation, and image removal.

### `file-handler.js` - FileHandler
Handles drag & drop functionality, file input, and file validation.

### `ui-manager.js` - UIManager
Manages progress indicators, statistics display, and UI state updates.

### `utils.js` - ImageUtils
Common utility functions for image processing, mobile detection, and formatting.

## Features

- **Drag & Drop**: Drop images directly onto the interface
- **Batch Processing**: Handles large image collections efficiently
- **WebP Conversion**: Automatic optimization to WebP format
- **Mobile Friendly**: Optimized batch sizes for mobile devices
- **Gallery Navigation**: Keyboard and click navigation
- **Real-time Stats**: Shows compression ratios and processing times
- **Image Management**: Remove individual images from the collection

## Usage

1. Open `index.html` in a modern web browser
2. Drag and drop images or click to select files
3. View optimized images in the gallery
4. Navigate with arrow keys or click controls
5. Remove individual images with the × button
6. Reset all images with the Reset button

## Browser Compatibility

Requires a modern browser with support for:
- ES6 Modules
- Canvas API
- File API
- WebP format support
