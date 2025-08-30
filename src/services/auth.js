import createError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendEmail } from "./brevo.js"; // Brevo e-posta servisi
import bcrypt from "bcrypt";

export const registerUser = async (userData) => {
  const { email, password, name } = userData;
  const user = await User.findOne({ email });

  if (user) {
    throw createError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });
  return newUser;
};

export const loginUser = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(401, "Invalid credentials");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createError(401, "Invalid credentials");
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(32).toString("hex");
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 gün

  const newSession = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return newSession;
};

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createError(401, "Session not found");
  }

  if (new Date() > session.refreshTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createError(401, "Refresh token expired");
  }

  await Session.deleteOne({ _id: session._id });

  const newAccessToken = crypto.randomBytes(32).toString("hex");
  const newRefreshToken = crypto.randomBytes(32).toString("hex");
  const newAccessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const newRefreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const newSession = await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: newAccessTokenValidUntil,
    refreshTokenValidUntil: newRefreshTokenValidUntil,
  });

  return newSession;
};

export const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};

// Yeni servis fonksiyonları

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, "User not found!");
  }

  const payload = { email, id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5m" });
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const emailHtml = `
    <h1>Password Reset</h1>
    <p>Click on the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
  `;

  try {
    await sendEmail({
      to: email,
      subject: "Password Reset Link",
      html: emailHtml,
    });
  } catch (error) {
    throw createError(500, "Failed to send the email, please try again later.");
  }
};

export const resetPassword = async (token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createError(401, "Token is expired or invalid.");
  }

  const user = await User.findOne({ email: decoded.email, _id: decoded.id });
  if (!user) {
    throw createError(404, "User not found!");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  await Session.deleteOne({ userId: user._id });
};
