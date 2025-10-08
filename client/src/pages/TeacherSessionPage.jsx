import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { socket } from '../services/socketService.js';
import Button from '../components/common/Button.jsx';
import PollChart from '../components/features/PollChart.jsx';
import ChatAndParticipants from '../components/common/ChatAndParticipants.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-component for the Question Creation Form ---
const CreateQuestionView = ({ onAskQuestion }) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([ { text: '' }, { text: '' } ]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, { text: '' }]);

  const handleSubmit = () => {
    if (!questionText.trim()) return toast.error('Please enter a question.');
    if (correctAnswerIndex === null) return toast.error('Please mark one option as correct.');
    if (options.some(opt => !opt.text.trim())) return toast.error('All options must have text.');

    const questionData = {
      questionText,
      options: options.map(o => o.text),
      correctAnswerIndex,
      timeLimit: Number(timeLimit),
    };
    onAskQuestion(questionData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white md:border-t md:border-b border-gray-200 md:py-12">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-left mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold text-primary bg-purple-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Intervue Poll
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Let's Get Started</h1>
            <p className="text-gray-500 mt-2">
                you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
            </p>
        </div>

        <div className="space-y-8">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold text-gray-700">Enter your question</label>
                    <select 
                        value={timeLimit} 
                        onChange={(e) => setTimeLimit(e.target.value)}
                        className="text-sm text-gray-600 font-medium border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-primary-light"
                    >
                        <option value={15}>15 seconds</option>
                        <option value={30}>30 seconds</option>
                        <option value={60}>60 seconds</option>
                        <option value={120}>120 seconds</option>
                    </select>
                </div>
                <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full p-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                    rows="4"
                    maxLength="100"
                    placeholder="e.g., Which planet is known as the Red Planet?"
                ></textarea>
                <p className="text-right text-sm text-gray-400 mt-1">{questionText.length}/100</p>
            </div>
            
            <div>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                    <label className="font-semibold text-gray-700">Edit Options</label>
                    <label className="font-semibold text-gray-700 mt-4 md:mt-0">Is it Correct?</label>
                </div>
                <div className="space-y-3">
                    {options.map((opt, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex items-center gap-4 w-full">
                                <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold flex-shrink-0">{index + 1}</span>
                                <input 
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="flex-grow p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                                    placeholder={`Option ${index+1}`}
                                />
                            </div>
                            <div className="flex gap-4 pl-10 md:pl-0">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="radio" name="correct-answer" onChange={() => setCorrectAnswerIndex(index)} className="form-radio h-4 w-4 text-primary focus:ring-primary-light"/> Yes
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-gray-500">
                                    <input type="radio" name="correct-answer-no" checked={correctAnswerIndex !== index} readOnly className="form-radio h-4 w-4 text-gray-400 focus:ring-gray-500" /> No
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addOption} className="text-primary font-semibold mt-4 text-sm border border-primary rounded-md px-3 py-1 hover:bg-purple-50 transition-colors">
                    + Add More option
                </button>
            </div>
        </div>
        
        <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmit}>Ask Question</Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Teacher Session Page Component ---
const TeacherSessionPage = () => {
    const { sessionId: joinCode } = useParams();
    const { user } = useAuth();
  
    const [view, setView] = useState('creating');
    const [pollHistory, setPollHistory] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [liveResults, setLiveResults] = useState({});
    const [participants, setParticipants] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
  
    useEffect(() => {
      socket.connect();
      socket.emit('teacher:createSession', { joinCode });
  
      const onUpdateResults = (r) => setLiveResults(r);
      const onUpdateParticipants = (p) => setParticipants(p);
      const onNewMessage = (msg) => {
        const messageWithSender = { ...msg, isMe: msg.sender === (user?.name || 'Teacher') };
        setChatMessages((prev) => [...prev, messageWithSender]);
      };
  
      socket.on('teacher:updateResults', onUpdateResults);
      socket.on('session:updateParticipants', onUpdateParticipants);
      socket.on('chat:newMessage', onNewMessage);
  
      return () => {
        socket.off('teacher:updateResults', onUpdateResults);
        socket.off('session:updateParticipants', onUpdateParticipants);
        socket.off('chat:newMessage', onNewMessage);
        socket.disconnect();
      };
    }, [joinCode, user]);
  
    const handleAskQuestion = (questionData) => {
      socket.emit('teacher:askQuestion', { joinCode, question: questionData });
      setCurrentQuestion(questionData);
      setLiveResults({});
      setPollHistory(prev => [...prev, { question: questionData, results: {} }]);
      setView('results');
    };
  
    const handleAskNewQuestion = () => {
      const lastQuestionIndex = pollHistory.length - 1;
      if (lastQuestionIndex >= 0) {
        const finalResultsForLastQuestion = { ...liveResults };
        setPollHistory(prev => {
          const newHistory = [...prev];
          newHistory[lastQuestionIndex].results = finalResultsForLastQuestion;
          return newHistory;
        });
      }
      setCurrentQuestion(null);
      setLiveResults({});
      setView('creating');
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(joinCode).then(() => {
          toast.success('Join code copied to clipboard!');
        }).catch(() => toast.error('Failed to copy code.'));
    };

    const handleSendMessage = (message) => {
        socket.emit('chat:sendMessage', { joinCode, message, sender: user?.name || 'Teacher' });
    };

    const handleKickParticipant = (participantId) => {
        if (window.confirm('Are you sure you want to remove this student?')) {
            socket.emit('teacher:kickParticipant', { joinCode, participantId });
            toast.success('Student has been removed.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="relative mb-8 md:mb-0">
                <div className="flex flex-col-reverse items-center gap-4 md:flex-row md:absolute top-0 right-0 w-full md:w-auto justify-center">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow">
                        <span className="text-sm font-medium text-gray-600">Join Code:</span>
                        <span className="font-mono text-primary font-bold">{joinCode}</span>
                        <button onClick={handleCopyCode} title="Copy code" className="p-1 text-gray-500 hover:text-primary rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                    <Button onClick={() => setView(v => v === 'history' ? (currentQuestion ? 'results' : 'creating') : 'history')}>
                        {view === 'history' ? '← Back' : 'View Poll history'}
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 md:mt-0"
                >
                    {view === 'creating' && <CreateQuestionView onAskQuestion={handleAskQuestion} />}

                    {view === 'results' && currentQuestion && (
                         <div className="w-full max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold text-center mb-6">Question</h2>
                            <PollChart question={currentQuestion} results={liveResults} />
                            <div className="mt-8 flex justify-center">
                                <Button onClick={handleAskNewQuestion}>+ Ask a new question</Button>
                            </div>
                        </div>
                    )}

                    {view === 'history' && (
                        <div className="w-full max-w-3xl mx-auto space-y-10">
                            <h1 className="text-4xl font-bold text-center">View Poll History</h1>
                            {pollHistory.length > 0 ? pollHistory.map((item, index) => (
                                <div key={index}>
                                <h2 className="font-bold text-lg mb-2">Question {index + 1}</h2>
                                <PollChart question={item.question} results={item.results} />
                                </div>
                            )) : <p className="text-center text-gray-500">No questions have been asked yet.</p>}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
    
            <button onClick={() => setIsChatOpen(true)} title="Open Chat & Participants" className="fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /></svg>
            </button>
            
            {isChatOpen && (
                <ChatAndParticipants 
                    participants={participants} 
                    messages={chatMessages} 
                    onSendMessage={handleSendMessage} 
                    onClose={() => setIsChatOpen(false)}
                    isTeacher={true}
                    onKickParticipant={handleKickParticipant}
                />
            )}
        </div>
      );
};
  
export default TeacherSessionPage;

