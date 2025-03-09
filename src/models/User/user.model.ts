import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";
import { NextFunction } from "express";
dotenv.config({ path: ".././src/config/config.env" });

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: string;
  emailVerified?: boolean;
  emailVerificationToken?: number;
  emailVerificationTokenExpires?: Date;
  passwordResetToken?: number;
  passwordResetTokenExpires?: Date;
  lastLogin?: Date;
  isActive?: boolean;
}
const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Invalid Email",
      },
    },
    password: {
      type: String,
      select: false,
      //validation will be before saving to db
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: Number,
    },
    emailVerificationTokenExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: Number,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//hash password before saving
//@ts-ignore
userSchema.pre<IUser>("save", async function (this: IUser, next: NextFunction) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//jwtToken
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET as string);
};

//compare password
userSchema.methods.comparePassword = async function (
  this: IUser,
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
