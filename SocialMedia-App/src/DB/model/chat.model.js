import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId, ref: "User",
    required: true
  },
  content: { type: String, required: true },
}, { timestamps: true });
const chatSchema = new Schema({
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    validate: {
      validator: function(v) {
        return v.length === 2;
      },
      message: '{PATH} must have exactly 2 users'
    }
  },
  messages: [messageSchema],
}, { timestamps: true });


export const chatModel = mongoose.model("Chat", chatSchema);