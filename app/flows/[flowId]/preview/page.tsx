import { PreviewClient } from './client';
import { generateFlowParams } from '@/lib/flows/static-params';

// Required for static export - generate all flow preview pages at build time
export const generateStaticParams = generateFlowParams;

interface Props {
  params: Promise<{ flowId: string }>;
}

export default async function PreviewPage({ params }: Props) {
  const { flowId } = await params;
  return <PreviewClient flowId={flowId} />;
}
