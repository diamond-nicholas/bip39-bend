const { Schema, model } = require('mongoose');

const UserModelSchema = new Schema({
  user_id: {
    type: String
  },
  mnemonic_phrase: {
    type: String,
    required: true,
  }
},{
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  });
const User = model('use', UserModelSchema);

module.exports = User;
