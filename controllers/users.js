// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
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
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(200).send(r);
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
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((r) => {
      res.status(201).send(r);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      return res.status(500).send('Server Error');
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
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
    upsert: true,
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
};
