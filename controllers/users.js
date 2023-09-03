// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const getUsers = (req, res) => {
  return User.find({})
    .then((r) => {
      return res.status(200).send(r);
    })
    .catch(() => {
      return res.status(500).send({ message: 'Server Error' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(new Error('Неверный Id'))
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Неверный id' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const createUser = (req, res) => {
  console.log(req.body);
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      return User.create({ name, about, avatar, email, password: hash })
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            email: user.email,
          });
        })
        .catch((err) => {
          console.log(err);
          if (err instanceof mongoose.Error.ValidationError) {
            return res.status(400).send({ message: 'Неверные данные' });
          }
          if (err.code === 11000) {
            return res.send({ message: 'Пользователь с таким Email уже зарегистрирован' });
          }
          return res.status(500).send('Server Error');
        });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((r) => {
      res.status(200).send(r);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      return res.status(500).send('Server Error');
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((r) => {
      res.status(200).send(r);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: 'Такого пользователя не существует' });
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send({ message: 'Неверные данные' });
          }
          const token = jwt.sign({ _id: user._id }, 'secret-code');
          res.cookie('jwt', token, {
            httpOnly: true,
          });
          return res.send({ token });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Server Error' });
    });
};

const getUserInfo = (req, res) => {
  return User.findById({ _id: req.user._id })
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Server Error' });
    });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
  getUserInfo,
};
