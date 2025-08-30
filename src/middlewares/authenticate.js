import createError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createError(401, "Authorization header not found"));
  }

  const [bearer, accessToken] = authHeader.split(" ");
  if (bearer !== "Bearer" || !accessToken) {
    return next(createError(401, "Invalid authorization header format"));
  }

  const session = await Session.findOne({ accessToken });
  if (!session) {
    return next(createError(401, "Session not found"));
  }

  if (new Date() > session.accessTokenValidUntil) {
    return next(createError(401, "Access token expired"));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    return next(createError(401, "User not found"));
  }

  req.user = user;
  next();
};