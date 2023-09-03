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
    link: Joi.string().required(),
  }),
}), createCard);
cardRouter.delete('/cards/:cardId', deleteCardById);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardRouter;
