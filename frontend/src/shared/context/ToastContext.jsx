import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export let globalToast = null;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  React.useEffect(() => {
    globalToast = toast;
    
    // Intercept native browser alerts and convert them to premium toasts
    window.alert = (msg) => {
      if (typeof msg === 'string') {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes('error') || lowerMsg.includes('fail') || lowerMsg.includes('invalid') || lowerMsg.includes('required')) {
          toast.error(msg);
        } else if (lowerMsg.includes('success') || lowerMsg.includes('thank')) {
          toast.success(msg);
        } else {
          toast.info(msg);
        }
      } else {
        toast.info(String(msg));
      }
    };
  }, [addToast]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 min-w-[320px] max-w-[420px] rounded-2xl shadow-[0_16px_40px_rgb(0,0,0,0.2)] backdrop-blur-2xl border ${
                t.type === 'success' 
                  ? 'bg-[#1a1c23]/90 border-green-500/30 text-white' 
                  : t.type === 'error' 
                  ? 'bg-[#1a1c23]/90 border-red-500/30 text-white'
                  : 'bg-[#1a1c23]/90 border-white/20 text-white'
              }`}
            >
              <div className={`shrink-0 ${
                t.type === 'success' ? 'text-green-400' : t.type === 'error' ? 'text-red-400' : 'text-blue-400'
              }`}>
                {t.type === 'success' && <CheckCircle2 size={22} />}
                {t.type === 'error' && <AlertCircle size={22} />}
                {t.type === 'info' && <Info size={22} />}
              </div>
              <p className="flex-1 text-[14px] font-semibold tracking-wide leading-tight">{t.message}</p>
              <button 
                onClick={() => removeToast(t.id)} 
                className="shrink-0 p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={16} className="opacity-70 hover:opacity-100 text-white" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
