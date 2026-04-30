export interface DemoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
}

export interface NewsletterFormData {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Valid dataset for demo/contact forms.
 * Uses example.com domains which are reserved for documentation/testing
 * and will never route to a real mailbox.
 */
export const validDemoForm: DemoFormData = {
  firstName: 'Test',
  lastName: 'Automation',
  email: 'test.automation@example-voly-testing.com',
  phone: '+441234567890',
  message: 'Automated test submission - please disregard. This was sent from a test environment.',
};

/**
 * Invalid dataset used to verify field-level validation feedback.
 */
export const invalidDemoForm = {
  email: 'not-a-valid-email',
  phone: 'abc',
};

/**
 * Valid dataset for the newsletter signup form.
 */
export const validNewsletterForm: NewsletterFormData = {
  firstName: 'Test',
  lastName: 'Automation',
  email: 'test.newsletter@example-voly-testing.com',
};
