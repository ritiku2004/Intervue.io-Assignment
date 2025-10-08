import React from 'react';
import { motion } from 'framer-motion';

const PollChart = ({ question, results, correctAnswerIndex = null }) => {
  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="bg-gray-700 text-white p-4 rounded-t-lg font-semibold -m-6 mb-6">
        <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-white text-gray-700 rounded-full text-xs font-bold">1</span>
            <span>{question.questionText}</span>
        </div>
      </div>
      <div className="space-y-4 pt-2">
        {question.options.map((option, index) => {
          const votes = results[index] || 0;
          const percentage = totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
          const isCorrect = correctAnswerIndex !== null && index === correctAnswerIndex;

          return (
            <div 
              key={index} 
              // The entire option container gets a green border if it's the correct one
              className={`w-full border-2 p-3 rounded-lg transition-all ${isCorrect ? 'border-green-500 bg-green-50' : 'border-transparent'}`}
            >
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-6 h-6 text-white rounded-full text-xs font-bold ${isCorrect ? 'bg-green-500' : 'bg-primary'}`}>{index + 1}</span>
                  <span>{option}</span>
                </div>
                <span className="font-bold">{percentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden relative">
                <motion.div
                  className={`h-4 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-primary'}`}
                  initial={{ width: `0%` }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
       <p className="text-right text-sm text-gray-500 mt-4">Total Votes: {totalVotes}</p>
    </div>
  );
};

export default PollChart;

