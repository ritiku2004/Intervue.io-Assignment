import asyncHandler from '../utils/asyncHandler.js';
import { services } from '../services/index.js';

export const createTeacher = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const data = await services.teacherService.createTeacher(name, email, password);
  
  res.status(201).json({
    status: 'success',
    statusCode: 201,
    data,
  });
});

export const viewMyProfile = asyncHandler(async (req, res, next) => {
  const data = await services.teacherService.getTeacherProfile(req.user._id);

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    data,
  });
});

export const viewMyPolls = asyncHandler(async (req, res, next) => {
  const data = await services.pollService.getPollsByTeacher(req.user._id);

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    data,
  });
});