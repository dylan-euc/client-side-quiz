import { defineFlow } from '../../engine/types';

/**
 * Weight Loss Onboarding Flow - v1.2.0
 * 
 * New features demonstrated:
 * - `email` question type
 * - `dropdown` question type
 * - `stop` type for hard stops
 * - `helpText` popups ("Why are we asking this?")
 */
export const weightLossOnboarding_v1_2_0 = defineFlow({
  id: 'weight-loss-onboarding',
  name: 'Weight Loss Onboarding',
  version: '1.2.0',
  description: 'Weight loss eligibility flow with email, dropdown, stop, and help text features',
  initialStep: 'welcome',

  steps: [
    {
      id: 'welcome',
      type: 'info',
      shortcode: '_welcome',
      question: 'Start your weight loss journey today',
      description:
        'Answer a few quick questions to see if our medically-supervised program is right for you. This takes less than 2 minutes.',
      next: 'email',
    },
    // NEW: Email question type
    {
      id: 'email',
      type: 'email',
      shortcode: 'patient_email',
      question: 'What is your email address?',
      description: 'We\'ll send your results and next steps to this address.',
      placeholder: 'you@example.com',
      validation: { required: true },
      helpText: {
        title: 'Why we need your email',
        content: 'Your email is used to:\n\n• Send you a copy of your assessment results\n• Allow you to resume if you leave partway through\n• Contact you about next steps if you\'re eligible\n\nWe never share your email with third parties.',
        linkText: 'Why do you need my email?',
      },
      next: 'age',
    },
    {
      id: 'age',
      type: 'number',
      shortcode: 'patient_age',
      question: 'What is your age?',
      description: 'Our program is available to adults aged 18 and over.',
      validation: { required: true, min: 1, max: 120 },
      helpText: {
        title: 'Age requirement',
        content: 'GLP-1 medications have been studied primarily in adults. Our program requires participants to be at least 18 years old to ensure safety and appropriate medical supervision.',
      },
      next: [
        { when: { lt: 18 }, then: 'stop-underage' },
        { default: 'sex' },
      ],
    },
    // NEW: Stop type for hard terminal screens
    {
      id: 'stop-underage',
      type: 'stop',
      question: 'Sorry, our program is for adults only',
      description: 'You must be 18 or older to participate in our weight loss program. Please speak with a parent or guardian and your doctor about healthy weight management options for your age.',
      next: '',
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
      helpText: {
        title: 'Why we ask about biological sex',
        content: 'Some medications interact differently based on biological sex. For example, certain GLP-1 medications have different safety profiles during pregnancy, so we need to know if pregnancy is a possibility for you.',
      },
      next: [
        { when: { equals: 'female' }, then: 'pregnancy' },
        { default: 'country' },
      ],
    },
    {
      id: 'pregnancy',
      type: 'radio',
      shortcode: 'pregnancy_status',
      question:
        'Are you currently pregnant or planning to become pregnant in the next 6 months?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
      validation: { required: true },
      helpText: {
        title: 'Pregnancy and GLP-1 medications',
        content: 'GLP-1 medications (like semaglutide and tirzepatide) are not recommended during pregnancy or when planning to conceive. Animal studies have shown potential risks, and there is limited human data.\n\nIf you become pregnant while on a GLP-1 medication, you should stop taking it immediately and consult your doctor.',
      },
      next: [
        { when: { equals: 'yes' }, then: 'stop-pregnancy' },
        { default: 'country' },
      ],
    },
    {
      id: 'stop-pregnancy',
      type: 'stop',
      question: 'GLP-1 medications are not safe during pregnancy',
      description: 'For the safety of you and your baby, we cannot prescribe weight loss medications during pregnancy or while planning to conceive. Please consult with your OB/GYN or midwife for safe weight management during this important time.',
      next: '',
    },
    // NEW: Dropdown question type
    {
      id: 'country',
      type: 'dropdown',
      shortcode: 'patient_country',
      question: 'Which country do you live in?',
      description: 'Our services are currently available in select countries.',
      placeholder: 'Select your country...',
      options: [
        { value: 'au', label: 'Australia' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'nz', label: 'New Zealand' },
        { value: 'ie', label: 'Ireland' },
        { value: 'sg', label: 'Singapore' },
        { value: 'hk', label: 'Hong Kong' },
        { value: 'other', label: 'Other country' },
      ],
      validation: { required: true },
      next: [
        { when: { equals: 'other' }, then: 'stop-region' },
        { default: 'weight' },
      ],
    },
    {
      id: 'stop-region',
      type: 'stop',
      question: 'We\'re not available in your region yet',
      description: 'Unfortunately, we don\'t currently operate in your country. We\'re expanding rapidly and hope to serve you soon. Join our waitlist to be notified when we launch in your area.',
      next: '',
    },
    {
      id: 'weight',
      type: 'number',
      shortcode: 'current_weight_kg',
      question: 'What is your current weight?',
      description: 'Please enter your weight in kilograms (kg).',
      validation: { required: true, min: 30, max: 300 },
      helpText: {
        title: 'Why we need your weight',
        content: 'We use your weight to calculate your BMI (Body Mass Index), which helps determine if you\'re a candidate for GLP-1 medications.\n\nGLP-1 medications are typically prescribed for people with:\n• BMI ≥ 30, or\n• BMI ≥ 27 with weight-related health conditions',
      },
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
      helpText: {
        title: 'Medical conditions and GLP-1 safety',
        content: 'Certain medical conditions may affect whether GLP-1 medications are safe for you:\n\n• Type 1 Diabetes: GLP-1s are not approved for T1D\n• Heart disease: May require dose adjustments\n• Kidney disease: Some GLP-1s need renal dosing\n• Thyroid conditions: History of medullary thyroid cancer is a contraindication\n• Pancreatitis: GLP-1s may increase risk of recurrence',
      },
      next: [
        { when: { includes: 'diabetes_type1' }, then: 'stop-t1d' },
        { when: { includes: 'pancreatitis' }, then: 'stop-pancreatitis' },
        { default: 'goals' },
      ],
    },
    {
      id: 'stop-t1d',
      type: 'stop',
      question: 'GLP-1 medications are not approved for Type 1 Diabetes',
      description: 'Our program uses GLP-1 medications which are specifically approved for Type 2 Diabetes and obesity, not Type 1 Diabetes. Please consult with your endocrinologist for weight management options that are safe with your condition.',
      next: '',
    },
    {
      id: 'stop-pancreatitis',
      type: 'stop',
      question: 'GLP-1 medications may not be safe with your history',
      description: 'Due to your history of pancreatitis, GLP-1 medications may increase your risk of a recurrence. We recommend discussing weight management options with your gastroenterologist or primary care provider.',
      next: '',
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
      next: 'outcome:eligible',
    },
  ],

  outcomes: {
    'outcome:eligible': {
      type: 'eligible',
      message:
        "Great news! Based on your answers, you may be a candidate for our weight loss program. We'll review your information and send next steps to your email.",
    },
  },
});

