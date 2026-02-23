import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PopupMsg from '../components/Shared/PopupMsg';

let popupRoot = null;
let currentCallback = null;
let root = null;
let isMounted = false;
let authModalFunction = null;

// Set this function from your component that has access to useAuthModal
export const setAuthModalFunction = (func) => {
  authModalFunction = func;
};

export const showAuthPopup = (message, callback, scenario = 'expired') => {
  // Clean up any existing popup first
  if (root) {
    try {
      root.unmount();
      if (popupRoot && document.body.contains(popupRoot)) {
        document.body.removeChild(popupRoot);
      }
    } catch (error) {
      console.warn('Cleanup error:', error);
    }
    popupRoot = null;
    root = null;
  }

  // Create new popup root
  popupRoot = document.createElement('div');
  popupRoot.id = 'auth-popup-root';
  document.body.appendChild(popupRoot);
  root = createRoot(popupRoot);
  
  currentCallback = callback;
  isMounted = true;

  const PopupWrapper = () => {
    const [show, setShow] = useState(true);

    const handleConfirm = () => {
      if (!isMounted) return; // Prevent updates after unmount
      
      setShow(false);
      
      // Only call currentCallback if it's a function
       if (typeof currentCallback === 'function') {
        currentCallback();
      }
      currentCallback = null;
      
      // Always open login modal in both scenarios
      if (typeof authModalFunction === 'function') {
        setTimeout(() => {
          authModalFunction("login");
        }, 300);
      }
      
    setTimeout(() => {
        if (isMounted) {
          cleanupPopup();
        }
      }, 100);
    };

    // Add cleanup on component unmount
    React.useEffect(() => {
      return () => {
        isMounted = false;
      };
    }, []);

    return (
      <PopupMsg
        text={message}
        show={show}
        closeAlert={handleConfirm}
        onConfirm={handleConfirm}
        openAuthModal={authModalFunction}
      />
    );
  };

  root.render(<PopupWrapper />);
};

// Separate cleanup function
const cleanupPopup = () => {
  if (isMounted) {
    isMounted = false;
  }
  
  if (root) {
    try {
      root.unmount();
    } catch (error) {
      console.warn('Unmount error:', error);
    }
    root = null;
  }
  
  if (popupRoot && document.body.contains(popupRoot)) {
    try {
      document.body.removeChild(popupRoot);
    } catch (error) {
      console.warn('DOM removal error:', error);
    }
    popupRoot = null;
  }
  
  currentCallback = null;
};