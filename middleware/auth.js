const jwt = require("jsonwebtoken");

function userAuthentication(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split("Bearer TOKEN:")[1].trim();

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) return res.sendStatus(403);
      req.user = user;

      next();
    });
  } catch (error) {
    res.json({ message: error?.message || "not authenticated" });
  }
}

module.exports = { userAuthentication };
