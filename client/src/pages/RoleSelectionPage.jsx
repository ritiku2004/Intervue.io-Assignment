import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios.js';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';

const RoleCard = ({ title, description, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 text-left h-full ${
      isSelected 
        ? 'border-primary shadow-lg bg-white' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}
  >
    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    <p className="text-gray-500 mt-1 text-sm">{description}</p>
  </div>
);

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleContinue = async () => {
    if (!selectedRole) {
      return toast.error('Please select a role to continue.');
    }
    
    if (selectedRole === 'teacher') {
      if (!isAuthenticated) {
        toast('Please log in to continue as a teacher.');
        return navigate('/login');
      }
      setIsLoading(true);
      try {
        const response = await api.post('/polls/create', { title: 'New Live Session' });
        const newPoll = response.data.data;
        navigate(`/session/${newPoll.joinCode}/teacher`);
      } catch (error) {
        toast.error('Could not create a new session.');
        setIsLoading(false);
      }
    } else {
        // If student is selected, navigate them to the join page.
        navigate('/join');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold text-primary bg-purple-100 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Intervue Poll
        </span>
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Welcome to the Live Polling System</h1>
        <p className="text-gray-500 mt-3 max-w-lg mx-auto">
          Please select the role that best describes you to begin using the live polling system
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <RoleCard
            title="I'm a Student"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            isSelected={selectedRole === 'student'}
            onClick={() => setSelectedRole('student')}
          />
          <RoleCard
            title="I'm a Teacher"
            description="Submit answers and view live poll results in real-time."
            isSelected={selectedRole === 'teacher'}
            onClick={() => setSelectedRole('teacher')}
          />
        </div>

        <button 
          onClick={handleContinue} 
          disabled={isLoading}
          className="px-8 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Creating Session...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;

