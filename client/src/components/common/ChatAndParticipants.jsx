import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../hooks/useAuth';

const ChatAndParticipants = ({ messages, participants, onSendMessage, onClose, isTeacher, onKickParticipant }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [newMessage, setNewMessage] = useState('');
  const chatBodyRef = useRef(null);
  const { user } = useAuth();
  const currentUserName = user?.name || 'Me';

  // Effect to auto-scroll to the bottom of the chat
  useEffect(() => {
    if (activeTab === 'chat' && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header with Tabs and Close Button */}
      <header className="p-2 bg-gray-50 rounded-t-lg flex justify-between items-center border-b">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'chat' ? 'bg-white shadow text-primary border' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            Chat
          </button>
          <button 
            onClick={() => setActiveTab('participants')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'participants' ? 'bg-white shadow text-primary border' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            Participants
          </button>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-gray-200" title="Close">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </header>

      {/* Conditional Rendering based on Active Tab */}
      {activeTab === 'chat' && (
        <>
          <div ref={chatBodyRef} className="flex-grow p-4 space-y-4 overflow-y-auto h-80">
            {messages.map((msg, index) => {
              const isMe = msg.sender === currentUserName;
              return (
                <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className={`text-xs font-semibold px-1 ${isMe ? 'text-gray-500' : 'text-primary'}`}>{isMe ? 'You' : msg.sender}</span>
                  <p className={`max-w-xs text-sm p-3 rounded-lg break-words ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>{msg.message}</p>
                </div>
              );
            })}
            {messages.length === 0 && <p className="text-center text-sm text-gray-400 pt-16">No messages yet.</p>}
          </div>
          <form onSubmit={handleSend} className="p-3 border-t flex items-center space-x-2 bg-gray-50 rounded-b-lg">
            <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
            <Button type="submit">Send</Button>
          </form>
        </>
      )}

      {activeTab === 'participants' && (
        <div className="flex-grow p-2 overflow-y-auto h-96">
           <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="font-semibold text-gray-600 p-2">Name</th>
                        {isTeacher && <th className="font-semibold text-gray-600 p-2 text-right">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {participants.map(p => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 text-gray-800">{p.name}</td>
                            {isTeacher && (
                                <td className="p-2 text-right">
                                    <button onClick={() => onKickParticipant(p.id)} className="text-red-500 hover:underline font-semibold">
                                        Kick out
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
           </table>
           {participants.length === 0 && <p className="text-center text-sm text-gray-400 mt-4">No participants yet.</p>}
        </div>
      )}
    </div>
  );
};

export default ChatAndParticipants;

