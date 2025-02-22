import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// @desc    註冊新用戶
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    if (!userExists.isVerified) {
      const verificationToken = crypto.randomBytes(20).toString('hex');
      userExists.verificationToken = verificationToken;
      await userExists.save();

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

      await sendEmail({
        email: userExists.email,
        subject: '請驗證您的電子郵件',
        message: `請點擊以下連結驗證您的電子郵件：${verificationUrl}`,
      });

      res.status(400);
      throw new Error('此信箱已註冊但尚未驗證，新的驗證郵件已發送，請查收');
    }

    res.status(400);
    throw new Error('此信箱已註冊');
  }

  const verificationToken = crypto.randomBytes(20).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
  });

  if (user) {
    generateToken(res, user._id);

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    await sendEmail({
      email: user.email,
      subject: '請驗證您的電子郵件',
      message: `請點擊以下連結驗證您的電子郵件：${verificationUrl}`,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: '註冊成功，請查收驗證郵件',
    });
  } else {
    res.status(400);
    throw new Error('無效的用戶數據');
  }
});

// @desc    用戶登入
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error('請先驗證您的電子郵件');
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('信箱或密碼錯誤');
  }
});

// @desc    用戶登出
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: '已登出' });
});

// @desc    發送忘記密碼郵件
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('找不到該用戶');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: '密碼重設請求',
      message: `請點擊以下連結重設您的密碼：${resetUrl}`,
    });

    res.json({ message: '重設密碼郵件已發送' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error('郵件發送失敗');
  }
});

// @desc    重設密碼
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('無效或過期的重設密碼令牌');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: '密碼重設成功' });
});

// @desc    獲取用戶資料
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('用戶未找到');
  }
});

// @desc    驗證用戶郵件
// @route   GET /api/users/verify/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  // 先檢查是否已經驗證過
  const verifiedUser = await User.findOne({
    isVerified: true,
    $or: [
      { verificationToken: req.params.token },
      { _id: { $exists: true } }, // 這會匹配所有文檔
    ],
  });

  if (verifiedUser) {
    return res.json({
      message: '郵件驗證成功',
      alreadyVerified: true,
    });
  }

  // 尋找未驗證的用戶
  const user = await User.findOne({
    verificationToken: req.params.token,
    isVerified: false,
  });

  if (!user) {
    res.status(400);
    throw new Error('無效的驗證令牌');
  }

  // 進行驗證
  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({
    message: '郵件驗證成功',
    alreadyVerified: false,
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  verifyEmail,
};
