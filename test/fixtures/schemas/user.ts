import { Schema } from 'mongoose';

export default new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
    minlength: 2,
    index: true,
    trim: true
  }
});
