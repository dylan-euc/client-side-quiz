/**
 * Centralized color mappings for question types.
 * Single source of truth for all type-related styling.
 */

export interface QuestionTypeColors {
  /** Background color for badges/pills */
  badge: string;
  /** Border color for nodes/cards */
  border: string;
  /** Background color for nodes/cards */
  bg: string;
  /** Full color class for bordered badges (e.g., in lists) */
  badgeFull: string;
}

/**
 * Color mappings for each question type.
 * Used by flow graph nodes, visualizer, and metadata.
 */
export const questionTypeColors: Record<string, QuestionTypeColors> = {
  radio: {
    badge: 'bg-purple-500',
    border: 'border-purple-400',
    bg: 'bg-purple-50',
    badgeFull: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  checkbox: {
    badge: 'bg-indigo-500',
    border: 'border-indigo-400',
    bg: 'bg-indigo-50',
    badgeFull: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  text: {
    badge: 'bg-blue-500',
    border: 'border-blue-400',
    bg: 'bg-blue-50',
    badgeFull: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  number: {
    badge: 'bg-cyan-500',
    border: 'border-cyan-400',
    bg: 'bg-cyan-50',
    badgeFull: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  },
  date: {
    badge: 'bg-teal-500',
    border: 'border-teal-400',
    bg: 'bg-teal-50',
    badgeFull: 'bg-teal-100 text-teal-700 border-teal-200',
  },
  email: {
    badge: 'bg-amber-500',
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    badgeFull: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  dropdown: {
    badge: 'bg-orange-500',
    border: 'border-orange-400',
    bg: 'bg-orange-50',
    badgeFull: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  info: {
    badge: 'bg-gray-500',
    border: 'border-gray-400',
    bg: 'bg-gray-50',
    badgeFull: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  stop: {
    badge: 'bg-red-500',
    border: 'border-red-400',
    bg: 'bg-red-50',
    badgeFull: 'bg-red-100 text-red-700 border-red-200',
  },
};

/**
 * Default colors for unknown question types
 */
export const defaultColors: QuestionTypeColors = {
  badge: 'bg-gray-500',
  border: 'border-gray-300',
  bg: 'bg-white',
  badgeFull: 'bg-gray-100 text-gray-700 border-gray-200',
};

/**
 * Get colors for a question type, with fallback to defaults
 */
export function getTypeColors(type: string): QuestionTypeColors {
  return questionTypeColors[type] || defaultColors;
}

