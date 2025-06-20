# Image Gallery Optimizer

A modern web application for optimizing and viewing image galleries with WebP compression.

## File Structure

```
vibes-gallery-viewer/
├── index.html              # Main HTML file
├── style.css              # All styles
├── app.js                 # Application entry point
├── js/
│   ├── main.js           # Main ImageOptimizer class
│   ├── image-processor.js # Image optimization and batch processing
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
- **Smart Format Selection**: WebP for modern browsers, JPEG fallback for iOS
- **WebP Polyfill**: Automatic format detection and fallback for iOS devices
- **Mobile Friendly**: Optimized batch sizes for mobile devices
- **Gallery Navigation**: Keyboard and click navigation
- **Real-time Stats**: Shows compression ratios and processing times
- **Image Management**: Remove individual images from the collection
- **Platform Awareness**: Shows appropriate warnings and tips for different devices

## Usage

1. Open `index.html` in a modern web browser
2. Drag and drop images or click to select files
3. View optimized images in the gallery
4. Navigate with arrow keys or click controls
5. Remove individual images with the × button
6. Reset all images with the Reset button

## Browser Compatibility & WebP Support

The application automatically detects WebP support and provides smart fallbacks:

### WebP Support Detection
- **Modern Browsers**: Uses WebP format for optimal compression
- **iOS/Safari**: Automatically falls back to JPEG for compatibility
- **Legacy Browsers**: JPEG fallback ensures universal support

### Platform-Specific Optimizations
- **iOS Devices**: 
  - Uses JPEG compression (85% quality)
  - Shows user-friendly notice about format choice
  - Optimized batch sizes for mobile performance
- **Android/Desktop**: 
  - Prefers WebP format for better compression
  - Larger batch sizes for faster processing

### Technical Implementation
The WebP detection uses a small base64-encoded WebP image to test browser support:
- If the test image loads successfully, WebP is supported
- If it fails, the app falls back to JPEG compression
- This ensures reliable detection across all platforms

Requires a modern browser with support for:
- ES6 Modules
- Canvas API
- File API
- Either WebP format support OR JPEG fallback capability
