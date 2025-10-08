import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const CreateQuestionForm = ({ onAskQuestion, onCancel }) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      questionText,
      options: options.filter(opt => opt.trim() !== ''), // Filter out empty options
      timeLimit: Number(timeLimit),
    };
    onAskQuestion(questionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Type your question..." value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
      <p className="font-medium">Options</p>
      {options.map((opt, index) => (
        <Input key={index} placeholder={`Option ${index + 1}`} value={opt} onChange={(e) => handleOptionChange(index, e.target.value)} />
      ))}
      <Button type="button" onClick={addOption}>Add Option</Button>
      <hr/>
      <div className="flex justify-end space-x-3">
        <Button type="button" onClick={onCancel} className="!bg-gray-300 !text-gray-800">Cancel</Button>
        <Button type="submit">Ask This Question</Button>
      </div>
    </form>
  );
};

export default CreateQuestionForm;