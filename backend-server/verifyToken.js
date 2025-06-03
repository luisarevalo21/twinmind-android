const auth = require("./firebase-admin.js");

const VerifyToken = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodeValue = await auth.auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
  } catch (e) {
    console.error("Error verifying token:", e);
    return res.json({ message: "Internal Error" });
  }
};

module.exports = VerifyToken;
