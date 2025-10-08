import asyncHandler from '../utils/asyncHandler.js';
import { services } from '../services/index.js';

export const createPoll = asyncHandler(async (req, res, next) => {
  const data = await services.pollService.createPoll(req.user._id, req.body.title);
  
  res.status(201).json({
    status: 'success',
    statusCode: 201,
    data,
  });
});