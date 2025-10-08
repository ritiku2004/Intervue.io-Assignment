import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../services/socketService.js';
import { toast } from 'react-hot-toast';
import { useCountdown } from '../hooks/useCountdown.js';

import PollChart from '../components/features/PollChart.jsx';
import ChatAndParticipants from '../components/common/ChatAndParticipants.jsx';
import Spinner from '../components/common/Spinner.jsx';
import Button from '../components/common/Button.jsx';

const StudentSessionPage = () => {
  const { sessionId: joinCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const studentName = location.state?.name;

  const [participants, setParticipants] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [finalResults, setFinalResults] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  // Countdown hook for the timer
  const { seconds, start, isRunning } = useCountdown();

  useEffect(() => {
    if (!studentName) {
      toast.error("Please join the session correctly.");
      navigate(`/session/${joinCode}`);
      return;
    }

    socket.connect();
    socket.emit('student:joinSession', { joinCode, name: studentName });

    const onNewQuestion = (q) => { 
      setCurrentQuestion(q);
      setHasVoted(false);
      setSelectedOption(null);
      setFinalResults(null);
      start(q.timeLimit); // Start countdown with duration from teacher
      toast('A new question has been asked!', { icon: '❓' });
    };
    const onFinalResults = (payload) => {
        setFinalResults(payload); // Payload includes results and correctAnswerIndex
    };
    const onUpdateParticipants = (p) => setParticipants(p);
    const onNewMessage = (msg) => setChatMessages((prev) => [...prev, msg]);

    socket.on('student:newQuestion', onNewQuestion);
    socket.on('session:finalResults', onFinalResults);
    socket.on('session:updateParticipants', onUpdateParticipants);
    socket.on('chat:newMessage', onNewMessage);

    return () => {
      socket.off('student:newQuestion', onNewQuestion);
      socket.off('session:finalResults', onFinalResults);
      socket.off('session:updateParticipants', onUpdateParticipants);
      socket.off('chat:newMessage', onNewMessage);
      socket.disconnect();
    };
  }, [joinCode, studentName, navigate, start]);
  
  const handleSubmit = () => {
    if (selectedOption === null) {
      return toast.error("Please select an option.");
    }
    setHasVoted(true);
    toast.success("Your answer was submitted!");
    socket.emit('student:submitAnswer', { joinCode, studentName, answerIndex: selectedOption });
  };
  
  const handleSendMessage = (message) => {
    socket.emit('chat:sendMessage', { joinCode, message, sender: studentName });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <main className="bg-white p-8 rounded-lg shadow-lg">
            {!currentQuestion ? (
              <div className="text-center py-16 flex flex-col items-center">
                <Spinner />
                <p className="text-xl text-gray-600 mt-4">Waiting for the teacher to ask a question...</p>
              </div>
            ) : !finalResults ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Question</h2>
                    {isRunning && (
                      <div className="flex items-center gap-2 text-red-500 font-bold text-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>00:{seconds.toString().padStart(2, '0')}</span>
                      </div>
                    )}
                </div>
                <div className="bg-gray-700 text-white p-4 rounded-t-lg font-semibold">{currentQuestion.questionText}</div>
                <div className="p-4 border rounded-b-lg space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button 
                        key={index} 
                        onClick={() => !hasVoted && setSelectedOption(index)}
                        disabled={hasVoted || !isRunning} // Button is disabled after voting or when time is up
                        className={`block w-full text-left p-3 rounded-md transition-all border-2 
                            ${selectedOption === index ? 'border-primary bg-purple-50' : 'border-gray-200 bg-white'}
                            ${hasVoted || !isRunning ? 'cursor-not-allowed opacity-60' : 'hover:border-primary-light'}
                        `}
                      >
                        <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold mr-3 inline-flex">{index + 1}</span>
                        {option}
                      </button>
                    ))}
                </div>
                {!hasVoted && (
                    <div className="mt-6 flex justify-center">
                        <Button onClick={handleSubmit} disabled={selectedOption === null || !isRunning}>
                            {isRunning ? 'Submit' : "Time's Up"}
                        </Button>
                    </div>
                )}
                 {hasVoted && (
                    <p className="text-center mt-6 text-lg text-primary font-semibold">Waiting for other students to vote...</p>
                )}
              </div>
            ) : (
                <div>
                    <h2 className="text-xl font-bold text-center mb-4">Final Results</h2>
                    <PollChart question={currentQuestion} results={finalResults.results} correctAnswerIndex={finalResults.correctAnswerIndex} />
                </div>
            )}
        </main>
      </div>

      <button onClick={() => setIsChatOpen(true)} title="Open Chat & Participants" className="fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /></svg>
      </button>
            
      {isChatOpen && <ChatAndParticipants participants={participants} messages={chatMessages} onSendMessage={handleSendMessage} onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default StudentSessionPage;