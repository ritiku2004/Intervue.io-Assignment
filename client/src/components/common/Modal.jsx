import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <header className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-bold text-secondary">{title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
            </header>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;