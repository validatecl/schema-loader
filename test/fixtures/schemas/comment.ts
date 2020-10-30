import { Schema } from 'mongoose';

export default new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'post',
    index: true
  },
  body: {
    type: String,
    required: true,
    maxlength: 1000,
    minlength: 50,
    trim: true
  }
});
