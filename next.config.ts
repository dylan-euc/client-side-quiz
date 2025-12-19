import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages hosting
  output: 'export',
  
  // GitHub Pages subdirectory deployment (only in production)
  basePath: isProduction ? '/client-side-quiz' : '',
  assetPrefix: isProduction ? '/client-side-quiz/' : '',
  
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

