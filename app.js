const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to db');
});
const app = express();
const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: '64e3b8431c9296f4cf080422'
  };

  next();
});

app.use(express.json());
app.use(userRouter);
app.use(cardRouter);


/* app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then(r => {
      if (r === null) {
        return res.status(404).send({ message: 'Пользователь не найден' });
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
}); */

/* app.post('/users', (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(r => {
      res.status(201).send(r);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      return res.status(500).send('Server Error');
    });
}); */

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});


