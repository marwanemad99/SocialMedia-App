import mongoose, { Schema, model } from "mongoose";
import { GENDER, PROVIDERS, ROLE } from "../../common/constants/index.js";

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tempEmail: {
    type: String,
  },
  password: {
    type: String,
    required: (data) => {
      return data?.provider === PROVIDERS.LOCAL;
    },
  },
  phone: String,
  address: String,
  DOB: Date,
  image: {
    secure_url: String,
    public_id: String,
  },
  coverImages: [
    {
      secure_url: String,
      public_id: String,
    },
  ],
  gender: {
    type: String,
    enum: GENDER,
    default: GENDER.MALE,
  },
  role: {
    type: String,
    enum: ROLE,
    default: ROLE.USER,
  },
  confirmEmail: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  changeCredentialTime: {
    type: Date,
  },
  provider: {
    type: String,
    enum: PROVIDERS,
    default: PROVIDERS.LOCAL,
  },
  viewers: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  twoStepVerification: {
    type: Boolean,
    default: false,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  friendRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],

}, { timestamps: true });

export const userModel = mongoose.models.User || model('User', userSchema);  