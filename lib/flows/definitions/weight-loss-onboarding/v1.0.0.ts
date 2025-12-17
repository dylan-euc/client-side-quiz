import { defineFlow } from '../../engine/types';

/**
 * Weight Loss Onboarding Flow - v1.0.0
 * Initial release
 */
export const weightLossOnboarding_v1_0_0 = defineFlow({
  id: 'weight-loss-onboarding',
  name: 'Weight Loss Onboarding',
  version: '1.0.0',
  description: 'Initial consultation flow for weight loss program eligibility',
  initialStep: 'welcome',

  steps: [
    {
      id: 'welcome',
      type: 'info',
      shortcode: '_welcome',
      question: 'Welcome to your weight loss journey',
      description:
        'This quick assessment will help us understand your health profile and determine if our program is right for you. It takes about 2 minutes to complete.',
      next: 'age',
    },
    {
      id: 'age',
      type: 'number',
      shortcode: 'patient_age',
      question: 'How old are you?',
      description: 'You must be 18 or older to participate in our program.',
      validation: { required: true, min: 1, max: 120 },
      next: [
        { when: { lt: 18 }, then: 'outcome:ineligible-age' },
        { default: 'sex' },
      ],
    },
    {
      id: 'sex',
      type: 'radio',
      shortcode: 'patient_sex',
      question: 'What is your biological sex?',
      description: 'This helps us understand which medications are safe for you.',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
      validation: { required: true },
      next: [
        { when: { equals: 'female' }, then: 'pregnancy' },
        { default: 'weight' },
      ],
    },
    {
      id: 'pregnancy',
      type: 'radio',
      shortcode: 'pregnancy_status',
      question:
        'Are you currently pregnant or planning to become pregnant in the next 6 months?',
      description:
        'GLP-1 medications are not recommended during pregnancy or while planning to conceive.',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
      validation: { required: true },
      next: [
        { when: { equals: 'yes' }, then: 'outcome:ineligible-pregnancy' },
        { default: 'weight' },
      ],
    },
    {
      id: 'weight',
      type: 'number',
      shortcode: 'current_weight_kg',
      question: 'What is your current weight?',
      description: 'Please enter your weight in kilograms (kg).',
      validation: { required: true, min: 30, max: 300 },
      next: 'height',
    },
    {
      id: 'height',
      type: 'number',
      shortcode: 'height_cm',
      question: 'What is your height?',
      description: 'Please enter your height in centimeters (cm).',
      validation: { required: true, min: 100, max: 250 },
      next: 'medical-conditions',
    },
    {
      id: 'medical-conditions',
      type: 'checkbox',
      shortcode: 'medical_conditions',
      question: 'Do you have any of the following conditions?',
      description: 'Select all that apply, or select "None of the above".',
      options: [
        { value: 'diabetes_type1', label: 'Type 1 Diabetes' },
        { value: 'diabetes_type2', label: 'Type 2 Diabetes' },
        { value: 'heart_disease', label: 'Heart disease' },
        { value: 'kidney_disease', label: 'Kidney disease' },
        { value: 'thyroid', label: 'Thyroid condition' },
        { value: 'pancreatitis', label: 'History of pancreatitis' },
        { value: 'none', label: 'None of the above' },
      ],
      validation: { required: true },
      next: [
        { when: { includes: 'diabetes_type1' }, then: 'outcome:ineligible-t1d' },
        { when: { includes: 'pancreatitis' }, then: 'outcome:ineligible-pancreatitis' },
        { default: 'goals' },
      ],
    },
    {
      id: 'goals',
      type: 'radio',
      shortcode: 'weight_loss_goal',
      question: 'What is your primary weight loss goal?',
      options: [
        { value: 'lose_5_10', label: 'Lose 5-10 kg' },
        { value: 'lose_10_20', label: 'Lose 10-20 kg' },
        { value: 'lose_20_plus', label: 'Lose 20+ kg' },
        { value: 'maintain', label: 'Maintain current weight' },
      ],
      validation: { required: true },
      next: 'motivation',
    },
    {
      id: 'motivation',
      type: 'checkbox',
      shortcode: 'motivation_factors',
      question: 'What motivates you to lose weight?',
      description: 'Select all that apply.',
      options: [
        { value: 'health', label: 'Improve my health' },
        { value: 'energy', label: 'Have more energy' },
        { value: 'appearance', label: 'Feel better about my appearance' },
        { value: 'mobility', label: 'Improve mobility and fitness' },
        { value: 'medical', label: 'Medical advice from my doctor' },
        { value: 'other', label: 'Other' },
      ],
      validation: { required: true },
      next: 'outcome:eligible',
    },
  ],

  outcomes: {
    'outcome:eligible': {
      type: 'eligible',
      message:
        "Great news! Based on your answers, you may be a candidate for our weight loss program. A healthcare provider will review your information and reach out to discuss next steps.",
    },
    'outcome:ineligible-age': {
      type: 'ineligible',
      reason: 'age',
      message:
        'Unfortunately, you must be 18 or older to participate in our program. Please consult with a healthcare provider for weight management options suitable for your age.',
    },
    'outcome:ineligible-pregnancy': {
      type: 'ineligible',
      reason: 'pregnancy',
      message:
        'GLP-1 medications are not recommended during pregnancy or while planning to conceive. Please consult with your healthcare provider for safe weight management options during this time.',
    },
    'outcome:ineligible-t1d': {
      type: 'ineligible',
      reason: 'type1_diabetes',
      message:
        'Our current program is not suitable for people with Type 1 Diabetes. Please consult with your endocrinologist for weight management options that are safe with your condition.',
    },
    'outcome:ineligible-pancreatitis': {
      type: 'ineligible',
      reason: 'pancreatitis',
      message:
        'Due to your history of pancreatitis, GLP-1 medications may not be suitable for you. Please consult with your healthcare provider for alternative weight management options.',
    },
  },
});
