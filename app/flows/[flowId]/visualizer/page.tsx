import { Suspense } from 'react';
import { VisualizerClient } from './client';
import { generateFlowParams } from '@/lib/flows/static-params';

// Required for static export - generate all flow visualizer pages at build time
export const generateStaticParams = generateFlowParams;

interface Props {
  params: Promise<{ flowId: string }>;
}

function VisualizerLoading() {
  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading visualizer...</p>
      </div>
    </div>
  );
}

export default async function FlowVisualizerPage({ params }: Props) {
  const { flowId } = await params;
  return (
    <Suspense fallback={<VisualizerLoading />}>
      <VisualizerClient flowId={flowId} />
    </Suspense>
  );
}
