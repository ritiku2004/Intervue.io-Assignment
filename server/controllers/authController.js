import asyncHandler from '../utils/asyncHandler.js';
import { services } from '../services/index.js';

export const loginTeacher = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const data = await services.authService.loginTeacher(email, password);
  
  res.status(200).json({
    status: 'success',
    statusCode: 200,
    data,
  });
});