const User = require('../models/User');
const Role = require('../models/Role');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
  async login(req, res) {
    try {
      const {
        username,
        password
      } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400)
          .json({ message: 'user_not_found' });
      } else {
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
          return res.status(400)
            .json({ message: 'invalid_password' });
        } else {
          const token = generateAccessToken(user._id, user.roles);
          return res.json({ token });
        }
      }
    } catch (e) {
      res.status(40)
        .json({
          message: 'login_error',
          err: e.message
        });
    }
  }
}

module.exports = new authController();
