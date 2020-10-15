const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DueSchema = new Schema(
  {
    reg_no: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    amount_due: {
      type: Number,
      required: true,
    },
    details: {
      type: String,
    },
    is_clear: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Due', DueSchema);
