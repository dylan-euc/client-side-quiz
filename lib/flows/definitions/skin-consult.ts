import { defineFlow } from '../engine/types';

export const skinConsult = defineFlow({
  id: 'skin-consult',
  name: 'Skin Consultation',
  version: '1.0.0',
  description: 'Initial skin health assessment for personalized treatment recommendations',
  initialStep: 'welcome',

  steps: [
    {
      id: 'welcome',
      type: 'info',
      shortcode: '_welcome',
      question: 'Skin Health Assessment',
      description:
        "Let's understand your skin better. This quick assessment will help us recommend the right treatment for you.",
      next: 'primary-concern',
    },
    {
      id: 'primary-concern',
      type: 'radio',
      shortcode: 'primary_skin_concern',
      question: 'What is your primary skin concern?',
      options: [
        { value: 'acne', label: 'Acne or breakouts' },
        { value: 'aging', label: 'Signs of aging (wrinkles, fine lines)' },
        { value: 'pigmentation', label: 'Uneven skin tone or dark spots' },
        { value: 'dryness', label: 'Dry or dehydrated skin' },
        { value: 'sensitivity', label: 'Sensitive or reactive skin' },
        { value: 'other', label: 'Other concern' },
      ],
      validation: { required: true },
      next: [
        { when: { equals: 'acne' }, then: 'acne-severity' },
        { when: { equals: 'aging' }, then: 'aging-concerns' },
        { default: 'skin-type' },
      ],
    },
    {
      id: 'acne-severity',
      type: 'radio',
      shortcode: 'acne_severity',
      question: 'How would you describe your acne?',
      options: [
        { value: 'mild', label: 'Mild - occasional pimples' },
        { value: 'moderate', label: 'Moderate - regular breakouts' },
        { value: 'severe', label: 'Severe - persistent, painful acne' },
        { value: 'cystic', label: 'Cystic - deep, inflamed bumps' },
      ],
      validation: { required: true },
      next: 'skin-type',
    },
    {
      id: 'aging-concerns',
      type: 'checkbox',
      shortcode: 'aging_concerns',
      question: 'Which signs of aging concern you most?',
      description: 'Select all that apply.',
      options: [
        { value: 'fine_lines', label: 'Fine lines' },
        { value: 'wrinkles', label: 'Deep wrinkles' },
        { value: 'sagging', label: 'Loss of firmness/sagging' },
        { value: 'dark_circles', label: 'Dark circles under eyes' },
        { value: 'dullness', label: 'Dull, tired-looking skin' },
      ],
      validation: { required: true },
      next: 'skin-type',
    },
    {
      id: 'skin-type',
      type: 'radio',
      shortcode: 'skin_type',
      question: 'What is your skin type?',
      description: 'Think about how your skin typically feels by midday.',
      options: [
        { value: 'oily', label: 'Oily - shiny, prone to enlarged pores' },
        { value: 'dry', label: 'Dry - tight, flaky, rough texture' },
        { value: 'combination', label: 'Combination - oily T-zone, dry cheeks' },
        { value: 'normal', label: 'Normal - balanced, few issues' },
        { value: 'sensitive', label: 'Sensitive - easily irritated, reactive' },
      ],
      validation: { required: true },
      next: 'current-routine',
    },
    {
      id: 'current-routine',
      type: 'radio',
      shortcode: 'current_skincare_routine',
      question: 'How would you describe your current skincare routine?',
      options: [
        { value: 'none', label: 'I don\'t have a routine' },
        { value: 'basic', label: 'Basic - cleanser and moisturizer' },
        { value: 'moderate', label: 'Moderate - several products' },
        { value: 'extensive', label: 'Extensive - multi-step routine' },
      ],
      validation: { required: true },
      next: 'allergies',
    },
    {
      id: 'allergies',
      type: 'radio',
      shortcode: 'skin_allergies',
      question: 'Do you have any known allergies to skincare ingredients?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: 'Not sure' },
      ],
      validation: { required: true },
      next: [
        { when: { equals: 'yes' }, then: 'allergy-details' },
        { default: 'outcome:eligible' },
      ],
    },
    {
      id: 'allergy-details',
      type: 'text',
      shortcode: 'allergy_details',
      question: 'Please describe your allergies',
      description: 'List any ingredients or products that have caused reactions.',
      validation: { required: true, minLength: 3, maxLength: 500 },
      next: 'outcome:eligible',
    },
  ],

  outcomes: {
    'outcome:eligible': {
      type: 'eligible',
      message:
        "Thank you for completing the assessment! Based on your answers, we can recommend a personalized skincare plan for you. A skin specialist will review your information and provide recommendations.",
    },
  },
});
