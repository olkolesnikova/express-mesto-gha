// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  // const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-code');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};

module.exports = auth;
