import React from 'react';

const ParticipantList = ({ participants }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold text-lg mb-3 text-secondary">Participants ({participants.length})</h3>
      <ul className="space-y-2 max-h-48 overflow-y-auto">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center space-x-3 text-gray-700">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{p.name}</span>
          </li>
        ))}
        {participants.length === 0 && <p className="text-sm text-gray-500">No one has joined yet.</p>}
      </ul>
    </div>
  );
};

export default ParticipantList;