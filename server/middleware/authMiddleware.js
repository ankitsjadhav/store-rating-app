const { verifyJWT } = require("../utils/tokenUtils");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "authentication invalid" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };
    next();
  } catch (error) {
    res.status(401).json({ msg: "authentication invalid" });
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "unauthorized to access this route" });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
