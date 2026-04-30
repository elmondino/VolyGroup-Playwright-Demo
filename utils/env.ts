export const BASE_URL = process.env.BASE_URL ?? 'https://www.volygroup.com';
export const LOGIN_URL = process.env.LOGIN_URL ?? 'https://secure.voly.co.uk';
export const TEST_ENV = (process.env.TEST_ENV ?? 'prod').toLowerCase();

/**
 * Returns true when form submission tests are allowed to execute.
 * This guard prevents test data from reaching the live Voly CRM.
 * Set TEST_ENV=dev or TEST_ENV=staging in your .env file to enable submission.
 */
export function isSubmitEnabled(): boolean {
  return TEST_ENV === 'dev' || TEST_ENV === 'staging';
}

export const SUBMIT_SKIP_REASON =
  'Form submission is disabled for the production environment. ' +
  'Set TEST_ENV=dev or TEST_ENV=staging to enable these tests.';
