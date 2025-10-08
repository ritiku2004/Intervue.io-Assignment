import bcrypt from 'bcryptjs';
import { models } from '../models/index.js';
import generateToken from '../utils/generateToken.js';

export const loginTeacher = async (email, password) => {
  const user = await models.User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      token: generateToken(user._id),
    };
  } else {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
};