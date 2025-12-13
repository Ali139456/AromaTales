#!/bin/bash

# Setup script to copy images to public folder for Vite

echo "Setting up images for Aroma Tales website..."

# Create public directories
mkdir -p public/assets/images/products
mkdir -p public/assets/images/banners
mkdir -p public/assets/images/logo

# Copy images
echo "Copying product images..."
cp -r "drive-download-20251213T060439Z-3-001/For Website /"* public/assets/images/products/ 2>/dev/null || true

echo "Copying banner images..."
cp -r "drive-download-20251213T060439Z-3-001/Website Banners/"* public/assets/images/banners/ 2>/dev/null || true

echo "Copying logo files..."
cp -r "drive-download-20251213T060439Z-3-001/Logo/"* public/assets/images/logo/ 2>/dev/null || true

echo "Images setup complete!"
echo "You can now run 'npm run dev' to start the development server."
