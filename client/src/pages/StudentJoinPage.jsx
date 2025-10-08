import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const StudentJoinPage = () => {
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [step, setStep] = useState(1); // Step 1 for name, Step 2 for code
  const navigate = useNavigate();
  const { sessionId } = useParams();

  // If a session ID is in the URL, pre-fill the join code.
  useEffect(() => {
    if (sessionId) {
      setJoinCode(sessionId);
    }
  }, [sessionId]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Please enter your name.');
    }
    // If we already have the code from the URL, go straight to the live session.
    if (sessionId) {
      navigate(`/session/${sessionId}/live`, { state: { name } });
    } else {
      // Otherwise, go to the next step to ask for the join code.
      setStep(2);
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      return toast.error('Please enter a join code.');
    }
    navigate(`/session/${joinCode.trim()}/live`, { state: { name } });
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 overflow-x-hidden">
      <div className="w-full max-w-xl text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold text-primary bg-purple-100 rounded-full mb-4">
          Intervue Poll
        </span>
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Let's Get Started</h1>
        <p className="text-gray-500 mt-3 mx-auto">
          If you're a student, you'll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates.
        </p>

        <div className="mt-8 max-w-sm mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div>
                    <label className="block text-left font-semibold text-gray-700 mb-2">Enter your Name</label>
                    <input
                      type="text"
                      placeholder="Rahul Bajaj"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <button type="submit" className="w-full px-8 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg">
                    Continue
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && !sessionId && (
              <motion.div
                key="step2"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleCodeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-left font-semibold text-gray-700 mb-2">Enter Join Code</label>
                    <input
                      type="text"
                      placeholder="e.g., XYZ123"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                       className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <button type="submit" className="w-full px-8 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg">
                    Join Session
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StudentJoinPage;

