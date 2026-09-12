import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  slot: {
    type: String,
    enum: ['head', 'body', 'weapon', 'accessory', 'cosmetic'],
    required: true,
  },
  cost: { type: Number, required: true },
  icon: { type: String, default: '' }, // path/URL to sprite or emoji code
  minLevel: { type: Number, default: 1 }, // gate cooler items behind levels
});

const Item = mongoose.model('Item', itemSchema);
export default Item;