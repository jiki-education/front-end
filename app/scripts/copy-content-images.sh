#!/usr/bin/env bash
set -e

# Copy images from content package to app public directory
# This script is run during prebuild to ensure content images are available

CONTENT_IMAGES="../content/dist/images"
PUBLIC_IMAGES="public/images"

echo "📸 Copying content images..."

# Create public/images directory if it doesn't exist
mkdir -p "$PUBLIC_IMAGES"

# Copy each subdirectory if it exists
if [ -d "$CONTENT_IMAGES/blog" ]; then
  echo "  - Copying blog images..."
  cp -r "$CONTENT_IMAGES/blog" "$PUBLIC_IMAGES/"
fi

if [ -d "$CONTENT_IMAGES/articles" ]; then
  echo "  - Copying article images..."
  cp -r "$CONTENT_IMAGES/articles" "$PUBLIC_IMAGES/"
fi

if [ -d "$CONTENT_IMAGES/avatars" ]; then
  echo "  - Copying avatar images..."
  cp -r "$CONTENT_IMAGES/avatars" "$PUBLIC_IMAGES/"
fi

echo "✅ Content images copied successfully"
