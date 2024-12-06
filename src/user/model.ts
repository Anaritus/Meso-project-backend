import mongoose, { model, Schema } from 'mongoose';
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcryptjs';
import BadAuthError from '../auth/errors';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

/* eslint-disable no-unused-vars */
interface UserModel extends mongoose.Model<IUser> {
  checkAuth: (
    email: string,
    password: string,
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}
/* eslint-enable no-unused-vars */

const userSchema = new Schema<IUser, UserModel>(
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
      default:
        'https://pictures.s3.yandex.net/resources/Untitled_-_2024-05-06T195257.404_1715003590.png',
    },
    email: {
      type: String,
      validate: isEmail,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.static(
  'checkAuth',
  function checkAuth(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          throw new BadAuthError();
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            throw new BadAuthError();
          }
          return Promise.resolve(user);
        });
      });
  },
);

export default model<IUser, UserModel>('user', userSchema);
