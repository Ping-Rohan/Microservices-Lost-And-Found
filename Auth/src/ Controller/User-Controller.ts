import User from '../Modal/User';
import { issueJWT } from '../utils/IssueJWT';
import { randomBytes, createHash } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { CatchAsync, AppError } from '@codishrohan/common';
import { broker } from '../utils/rabbitmq';

const register = CatchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    const newUser = new User(request.body);

    const verificationToken = randomBytes(32).toString('hex');
    newUser.AccountVerificationToken = createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    await newUser.save();

    const token = issueJWT({ id: newUser._id, email: newUser.email });

    response.cookie('jwt', token, { httpOnly: true });
    response.status(201).json({
      message: 'Account created successfully',
      user: newUser,
      verificationLink: `${request.hostname}/api/v1/users/verify/${verificationToken}`,
    });
  }
);

const login = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new AppError('Please provide email and password both', 400));

    const userDoc = await User.findOne({ email });
    if (
      !userDoc ||
      !(await userDoc.comparePassword(password, userDoc.password))
    )
      return next(new AppError('Invalid email or password', 401));

    const token = issueJWT({ id: userDoc._id, email: userDoc.email });

    res.cookie('jwt', token, { httpOnly: true });

    res.status(200).json({
      message: 'Logged in successfully',
    });
  }
);

const currentUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    broker.PublishMessage({
      EXCHANGE_NAME: 'items',
      ROUTING_KEY: 'currentUser',
      message: { label: 'USER.UPDATED', user },
    });

    res.status(200).json({
      currentUser: user,
    });
  }
);

const logout = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('jwt');
    res.status(200).json({
      message: 'Logged out successfully',
    });
  }
);

const verifyAccount = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      AccountVerificationToken: hashedToken,
      id: req.user?.id,
    });
    if (!user) return next(new AppError('Invalid token', 400));

    user.isVerified = true;
    user.AccountVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: 'Account verified successfully',
    });
  }
);

export { register, login, currentUser, logout, verifyAccount };
