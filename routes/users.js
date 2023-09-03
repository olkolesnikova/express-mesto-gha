const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUserById, createUser, updateUserInfo, updateAvatar, login, getUserInfo,
} = require('../controllers/users');

userRouter.post('/signin', login);
userRouter.post('/signup', createUser);
userRouter.use(auth);
userRouter.get('/users/me', getUserInfo);
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.patch('/users/me', updateUserInfo);
userRouter.patch('/users/me/avatar', updateAvatar);


module.exports = userRouter;
