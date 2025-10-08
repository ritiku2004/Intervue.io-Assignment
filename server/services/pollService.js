import { models } from '../models/index.js';

export const createPoll = async (teacherId, title) => {
  const poll = new models.Poll({
    teacher: teacherId,
    title: title || 'New Poll Session',
    isActive: true,
  });
  return await poll.save();
};

export const getPollsByTeacher = async (teacherId) => {
  return await models.Poll.find({ teacher: teacherId }).sort({ createdAt: -1 });
};