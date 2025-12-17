'use client';

import { Step } from '../engine/types';
import { QuestionTypeDefinition } from './types';
import { questionTypeColors } from './colors';

// ============================================================================
// Info Question Type
// Informational screen with no input - just displays content
// Used for welcome screens, transitions, and explanations
// ============================================================================

interface InfoInputProps {
  step: Step;
  value: undefined;
  onChange: (value: undefined) => void;
  error?: string | null;
}

/**
 * Info type doesn't render an input - it's handled specially in QuestionRenderer
 * This component is here for consistency but returns null
 */
function InfoInput(_props: InfoInputProps) {
  // Info steps are rendered directly in QuestionRenderer
  // This component exists for registry consistency
  return null;
}

export const infoType: QuestionTypeDefinition = {
  type: 'info',
  name: 'Info',
  description: 'Informational screen (no input)',
  color: questionTypeColors.info.badgeFull,
  component: InfoInput as QuestionTypeDefinition['component'],
  example: {
    id: 'example-info',
    type: 'info',
    question: 'Great progress!',
    description:
      "You're doing well. The next section will ask about your lifestyle habits. This helps us personalize your experience.",
    next: 'next-step',
  },
};

