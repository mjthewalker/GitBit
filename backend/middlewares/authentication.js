
const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    // If no token is found, handle unauthenticated requests
    if (!tokenCookieValue) {
    //   return res.status(401).json({ error: "Authentication token is missing." });
    return next();
    }

    try {
      // Validate the token and attach the user payload to the request
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    //   next();
    } catch (error) {
      // Handle invalid or expired tokens
    //   return res.status(401).json({ error: "Invalid or expired token." });
    }
    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};