const Card = require('../models/card');
const mongoose = require('mongoose');

const getCards = (req, res) => {
  return Card.find({})
    .then(r => {
      return res.status(200).send(r);
    })
    .catch((err) => {
      return res.status(500).send({ message: 'Server Error' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then(r => {
      return res.status(201).send(r);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.send(card);
    })
    .catch((err) => {
      return res.status(500).send({ message: 'Server Error' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then(card => {
      return res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Server Error' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(card => {
      return res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Server Error' });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard
};