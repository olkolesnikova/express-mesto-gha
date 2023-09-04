const cardRouter = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.use(auth);
cardRouter.get('/cards', getCards);
cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9\--._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), createCard);
cardRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), deleteCardById);
cardRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), likeCard);
cardRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), dislikeCard);

module.exports = cardRouter;
