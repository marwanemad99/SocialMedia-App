import mongoose, { Schema, model } from 'mongoose';
import { commentModel } from './comment.model.js';

const postSchema = new Schema({
  content: {
    type: String,
    minlength: 2,
    maxlength: 1000,
    trim: true,
    required: function () {
      return this.attachments.length ? false : true;
    },
  },
  attachments: [{
    secure_url: String,
    public_id: String,
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  isDeleted: Boolean,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});


postSchema.virtual('comments', {
  localField: '_id',
  foreignField: 'postId',
  ref: 'Comment',
  justOne: true

});

postSchema.pre('findOneAndUpdate', async function (next) {

  const update = this.getUpdate();
  if (update.isDeleted) {
    await commentModel.updateMany({ postId: this.getQuery()._id }, { isDeleted: true });
  }

  next();
});
export const postModel = mongoose.models.Post || model('Post', postSchema);