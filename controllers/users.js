// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-error');
const InvalidDataError = require('../errors/invalid-data-error');
const ExistingDataError = require('../errors/existing-data-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const User = require('../models/user');

const getUsers = (req, res, next) => {
  return User.find({})
    .then((user) => {
      return res.send(user);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.CastError) {
        next(new InvalidDataError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  console.log(req.body);
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      return User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          res.send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          console.log(err);
          if (err instanceof mongoose.Error.ValidationError) {
            next(new InvalidDataError('Неверные данные'));
          }
          if (err.code === 11000) {
            next(new ExistingDataError('Пользователь с таким Email уже зарегистрирован'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidDataError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidDataError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Такого пользователя не существует');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверные данные');
          }
          const token = jwt.sign({ _id: user._id }, 'secret-code');
          res.cookie('jwt', token, {
            httpOnly: true,
          });
          return res.send({ token });
        });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  return User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
  getUserInfo,
};
