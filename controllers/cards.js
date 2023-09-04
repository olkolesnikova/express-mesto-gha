// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const InvalidDataError = require('../errors/invalid-data-error');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = (req, res, next) => {
  return Card.find({})
    .then((data) => {
      return res.send(data);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      return res.status(201).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidDataError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалять карточки других пользователей');
      }
      card.deleteOne()
        .then(() => {
          res.send({ message: 'Карточка успешно удалена' });
        })
        .catch(next);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new InvalidDataError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      return res.send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new InvalidDataError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      return res.send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new InvalidDataError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
