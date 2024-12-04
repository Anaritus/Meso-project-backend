import { model, Schema } from 'mongoose';
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: isURL,
      default:
        'https://pictures.s3.yandex.net/resources/Untitled_-_2024-05-06T195257.404_1715003590.png',
    },
    email: {
      type: String,
      validate: isEmail,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

export default model<IUser>('user', userSchema);
