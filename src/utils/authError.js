import i18n from '../i18n';

// Creates standardized auth error payload for middleware/popup handling.
export const createAuthError = (scenario = 'expired') => {
  let message = 'auth.sessionExpired';
  
  if (scenario === 'notLoggedIn') {
    message = 'auth.loginRequired';
  }
  
  return {
    message: i18n.t(message),
    isAuthError: true,
    scenario: scenario
  };
};
