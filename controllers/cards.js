// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const InvalidDataError = require('../errors/invalid-data-error');

const getCards = (req, res) => {
  return Card.find({})
    .then((r) => {
      return res.status(200).send(r);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Server Error' });
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((r) => {
      return res.status(201).send(r);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        throw new InvalidDataError('Неверные данные');
      }
      return res.status(500).send({ message: 'Server Error' });
    })
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .orFail(new Error('Неверный id'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return res.status(403).send({ message: 'Нельзя удалять карточки других пользователей' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.CastError) {
        throw new InvalidDataError('Неверный id');
      }
      return res.status(500).send({ message: 'Server Error' });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.CastError) {
        throw new InvalidDataError('Неверный id');
      }
      return res.status(500).send({ message: 'Server Error' });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Неверный id' });
      }
      throw new InvalidDataError('Неверный id');
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
