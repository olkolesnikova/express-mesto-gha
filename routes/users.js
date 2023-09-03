const userRouter = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUsers, getUserById, createUser, updateUserInfo, updateAvatar, login, getUserInfo,
} = require('../controllers/users');

userRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login);
userRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
userRouter.use(auth);
userRouter.get('/users/me', getUserInfo);
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required,
  }),
}), getUserById);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().default('Жак-Ив-Кусто').min(2).max(30),
    about: Joi.string().required().default('Исследователь').min(2).max(30),
  }),
}), updateUserInfo);
userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = userRouter;
