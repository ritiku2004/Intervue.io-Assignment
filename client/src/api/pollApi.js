import api from '../lib/axios';

export const createNewPoll = async (pollData) => {
  const response = await api.post('/polls/create', pollData);
  return response.data.data; // Return the created poll object
};