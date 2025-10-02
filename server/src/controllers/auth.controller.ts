import { UserModel } from '../models/user.model';
import { Request, Response } from 'express';
import { createValidationError, ResponseUtil } from '../utils/response';
import { generateToken } from '@config/jwt';

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, phone, password, image } = req.body;

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return ResponseUtil.badRequest(res, 'Email already exists', [
        createValidationError('email', 'Email already exists'),
      ]);
    }

    const phoneExists = await UserModel.findOne({ phone });
    if (phoneExists) {
      return ResponseUtil.badRequest(res, 'Phone number already exists', [
        createValidationError('phone', 'Phone number already exists'),
      ]);
    }

    const user = await UserModel.create({
      username,
      email,
      phone,
      password,
      image,
    });
    ResponseUtil.success(res, user, 'User created successfully');
  } catch (error) {
    ResponseUtil.internalError(res, 'Internal server error');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return ResponseUtil.badRequest(res, 'User not found', [
        createValidationError('email', 'User not found'),
      ]);
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return ResponseUtil.badRequest(res, 'Invalid password', [
        createValidationError('password', 'Invalid password'),
      ]);
    }
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });
    ResponseUtil.success(res, { user, token }, 'Login successful');
  } catch (error) {
    ResponseUtil.internalError(res, 'Internal server error');
  }
};
