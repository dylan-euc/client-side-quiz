import { QuestionTypeClient } from './client';
import { generateQuestionTypeParams } from '@/lib/flows/static-params';

// Required for static export - generate all question type preview pages at build time
export const generateStaticParams = generateQuestionTypeParams;

interface Props {
  params: Promise<{ type: string }>;
}

export default async function QuestionTypePreviewPage({ params }: Props) {
  const { type } = await params;
  return <QuestionTypeClient type={type} />;
}
