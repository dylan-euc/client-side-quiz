import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages hosting
  output: 'export',
  
  // GitHub Pages subdirectory deployment
  basePath: '/client-side-quiz',
  assetPrefix: '/client-side-quiz/',
  
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

