import bcrypt from 'bcryptjs';
import { models } from '../models/index.js';
import generateToken from '../utils/generateToken.js';

export const createTeacher = async (name, email, password) => {
  const userExists = await models.User.findOne({ email });
  if (userExists) {
    const error = new Error('A teacher with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const user = await models.User.create({ name, email, password: hashedPassword });
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

export const getTeacherProfile = async (userId) => {
  const user = await models.User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('Teacher profile not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};