// ============================================================================
// Global Shortcode Registry
// ============================================================================
// Shortcodes are used for backend/clinical mapping of quiz answers.
// Define all shortcodes here to ensure consistency across flows.
// ============================================================================

/**
 * Shortcode definition with metadata
 */
export interface ShortcodeDefinition {
  /** Human-readable description of what this shortcode captures */
  description: string;
  /** Expected data type of the answer */
  type: 'string' | 'number' | 'boolean' | 'string[]' | 'date';
  /** Category for organization */
  category: 'demographics' | 'medical' | 'lifestyle' | 'goals' | 'system';
}

/**
 * Global registry of all shortcodes.
 * Add new shortcodes here to use them in flows.
 */
export const SHORTCODES = {
  // ==========================================================================
  // System / Internal
  // ==========================================================================
  _welcome: {
    description: 'Welcome screen shown',
    type: 'string',
    category: 'system',
  },

  // ==========================================================================
  // Demographics
  // ==========================================================================
  patient_age: {
    description: 'Patient age in years',
    type: 'number',
    category: 'demographics',
  },
  patient_sex: {
    description: 'Patient biological sex (male/female)',
    type: 'string',
    category: 'demographics',
  },
  patient_dob: {
    description: 'Patient date of birth',
    type: 'date',
    category: 'demographics',
  },
  patient_email: {
    description: 'Patient email address',
    type: 'string',
    category: 'demographics',
  },
  patient_country: {
    description: 'Patient country of residence',
    type: 'string',
    category: 'demographics',
  },
  full_name: {
    description: 'Patient full legal name',
    type: 'string',
    category: 'demographics',
  },

  // ==========================================================================
  // Medical - General
  // ==========================================================================
  current_weight_kg: {
    description: 'Current weight in kilograms',
    type: 'number',
    category: 'medical',
  },
  height_cm: {
    description: 'Height in centimeters',
    type: 'number',
    category: 'medical',
  },
  medical_conditions: {
    description: 'List of existing medical conditions',
    type: 'string[]',
    category: 'medical',
  },
  current_medications: {
    description: 'List of current medications',
    type: 'string[]',
    category: 'medical',
  },
  allergies: {
    description: 'Known allergies',
    type: 'string[]',
    category: 'medical',
  },

  // ==========================================================================
  // Medical - Pregnancy/Reproductive
  // ==========================================================================
  pregnancy_status: {
    description: 'Current pregnancy or planning status',
    type: 'string',
    category: 'medical',
  },
  breastfeeding: {
    description: 'Currently breastfeeding',
    type: 'boolean',
    category: 'medical',
  },

  // ==========================================================================
  // Goals & Motivation
  // ==========================================================================
  weight_loss_goal: {
    description: 'Primary weight loss goal',
    type: 'string',
    category: 'goals',
  },
  motivation_factors: {
    description: 'Factors motivating weight loss',
    type: 'string[]',
    category: 'goals',
  },
  target_weight_kg: {
    description: 'Target weight in kilograms',
    type: 'number',
    category: 'goals',
  },

  // ==========================================================================
  // Lifestyle
  // ==========================================================================
  exercise_frequency: {
    description: 'How often patient exercises',
    type: 'string',
    category: 'lifestyle',
  },
  diet_type: {
    description: 'Current diet type or restrictions',
    type: 'string',
    category: 'lifestyle',
  },
  sleep_hours: {
    description: 'Average hours of sleep per night',
    type: 'number',
    category: 'lifestyle',
  },
  alcohol_consumption: {
    description: 'Alcohol consumption frequency',
    type: 'string',
    category: 'lifestyle',
  },
  smoking_status: {
    description: 'Smoking status',
    type: 'string',
    category: 'lifestyle',
  },
  lifestyle_activity: {
    description: 'Current activity level (sedentary, light, moderate, very)',
    type: 'string',
    category: 'lifestyle',
  },
  previous_diets: {
    description: 'Previous weight loss approaches tried',
    type: 'string[]',
    category: 'lifestyle',
  },

  // ==========================================================================
  // Skin / Dermatology
  // ==========================================================================
  primary_skin_concern: {
    description: 'Primary skin concern (acne, aging, pigmentation, etc.)',
    type: 'string',
    category: 'medical',
  },
  acne_severity: {
    description: 'Severity of acne (mild, moderate, severe, cystic)',
    type: 'string',
    category: 'medical',
  },
  aging_concerns: {
    description: 'Specific aging concerns (fine lines, wrinkles, sagging)',
    type: 'string[]',
    category: 'medical',
  },
  skin_type: {
    description: 'Skin type (oily, dry, combination, normal, sensitive)',
    type: 'string',
    category: 'medical',
  },
  current_skincare_routine: {
    description: 'Level of current skincare routine',
    type: 'string',
    category: 'lifestyle',
  },
  skin_allergies: {
    description: 'Whether patient has known skincare allergies',
    type: 'string',
    category: 'medical',
  },
  allergy_details: {
    description: 'Details of known allergies',
    type: 'string',
    category: 'medical',
  },
} as const satisfies Record<string, ShortcodeDefinition>;

/**
 * Type representing all valid shortcode keys
 */
export type Shortcode = keyof typeof SHORTCODES;

/**
 * Helper to get shortcode definition
 */
export function getShortcodeDefinition(shortcode: Shortcode): ShortcodeDefinition {
  return SHORTCODES[shortcode];
}

/**
 * Get all shortcodes in a category
 */
export function getShortcodesByCategory(category: ShortcodeDefinition['category']): Shortcode[] {
  return (Object.keys(SHORTCODES) as Shortcode[]).filter(
    (key) => SHORTCODES[key].category === category
  );
}

/**
 * Validate that a shortcode exists
 */
export function isValidShortcode(shortcode: string): shortcode is Shortcode {
  return shortcode in SHORTCODES;
}

