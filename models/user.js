// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле "Описание" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "Описание" - 2'],
    maxlength: [30, 'Максимальная длина поля "Описание" - 30'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => { validator.isURL(v); },
      message: 'Некорректный URL',
    },
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
