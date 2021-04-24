const { nanoid } = require("nanoid");
 
const validateCookie = (req, res, next) => {
  if (req.cookies.user_id) {
    next();
  } else {
    const new_id = nanoid();
    res.cookie("user_id", new_id, {
      maxAge: 1000 * 60 * 60 * 60 * 30,
    });
    next();
  }
};

module.exports = validateCookie;