import { Schema } from 'mongoose';

export default new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 5,
    index: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    maxlength: 1000,
    minlength: 50,
    trim: true
  }
});
