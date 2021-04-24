const jwt = require('jsonwebtoken');
const env = process.env;

const ValidateToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized. No token found in header"
      });
    }
    try {
      const jwtToken = authorization ? authorization.split(" ")[1] : undefined;
  
      if (!jwtToken) {
        return res.status(400).json({
          status: "error",
          message: "Token not formatted properly"
        });
      }
      if (jwtToken) {
        const decoded = jwt.verify(jwtToken, env.SECRET_KEY);
        
        if(decoded.payload !== env.PAYLOAD) {
            return res.status(403).json({
                status: "error",
                message: "You are not authorized to perform this operation"
            });
        }

        return next();
      }
      
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(400).json({
          status: "error",
          message: "EXPIRED_TOKEN",
          error_message: error.message
        });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({
          status: "error",
          message: "INVALID_OR_BAD_TOKEN",
          error_message: error.message
        });
      }
      return res.status(400).json({
        status: "error",
        message: "UNKNOWN_ERROR_OCURRED",
        error_message: error.message
      });
    }
}

module.exports = ValidateToken;