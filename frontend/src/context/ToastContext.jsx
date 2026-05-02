import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export { ToastContext };
