import { history } from "../index";
import { createAuthError } from "../utils/authError";
import { showAuthPopup } from "../utils/showAlert";

export const authMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith('/rejected')) {
    const error = action.payload;
    
    if (error?.isAuthError) {
      // Show popup and only redirect when user clicks OK
      showAuthPopup(
       error.message,
       error.scenario || 'expired'
        // () => {
        //   // This callback only executes when user confirms
        //   // history.push('/');
        // }
      );

      // Clear the error state
      return next({
        ...action,
        payload: null,
        error: null
      });
    }
  }
  
  return next(action);
};