import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import { models } from '../models/index.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await models.User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        const error = new Error('User not found for this token');
        error.statusCode = 401;
        throw error;
      }
      next();
    } catch (err) {
      const error = new Error('Not authorized, token failed');
      error.statusCode = 401;
      throw error;
    }
  }

  if (!token) {
    const error = new Error('Not authorized, no token provided');
    error.statusCode = 401;
    throw error;
  }
});