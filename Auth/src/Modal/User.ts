import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
  profilePicture: string;
  isVerified: boolean;
  AccountVerificationToken: string | undefined;
  comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'Invalid email address'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      min: 6,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirm your password'],
      validate: {
        validator: function (this: IUser, el: string) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    profilePicture: {
      type: String,
      default:
        'https://icon-library.com/images/default-user-icon/default-user-icon-11.jpg',
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    AccountVerificationToken: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
        delete ret.__v;
        delete ret.AccountVerificationToken;
      },
    },
  }
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isNew || !this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
