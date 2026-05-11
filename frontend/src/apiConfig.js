/** Base URL for the LTI API (no trailing slash). Set REACT_APP_API_URL in .env for CI or non-default hosts. */
export const getApiBaseUrl = () => {
  const base = process.env.REACT_APP_API_URL || 'http://localhost:3010';
  return base.replace(/\/$/, '');
};
