import jwt from "jsonwebtoken";

const parseAuthHeader = (header) => {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
};

export const auth = (req, res, next) => {
  const token = parseAuthHeader(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const optionalAuth = (req, _res, next) => {
  const token = parseAuthHeader(req.headers.authorization);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
  } catch (err) {
    // ignore invalid tokens for optional path
  }
  next();
};

