import { redirect } from 'next/navigation';
import { generateFlowParams } from '@/lib/flows/static-params';

// Required for static export - generate all quiz redirect pages at build time
export const generateStaticParams = generateFlowParams;

interface Props {
  params: Promise<{ flowId: string }>;
}

/**
 * Quiz Page - Redirects to Preview Mode
 * 
 * The full quiz experience with database persistence requires a backend.
 * For static GitHub Pages hosting, we redirect to the preview mode which
 * provides the same quiz experience without persistence.
 * 
 * To enable full quiz functionality with persistence, deploy to a platform
 * that supports Next.js server features (Vercel, Railway, etc.) and remove
 * the `output: 'export'` from next.config.ts.
 */
export default async function QuizRedirectPage({ params }: Props) {
  const { flowId } = await params;
  redirect(`/flows/${flowId}/preview`);
}
