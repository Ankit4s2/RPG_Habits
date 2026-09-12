import mongoose from "mongoose";
import bcrypt from "bcrypt";

const equippedItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    slot: { type: String, enum: ['head', 'body', 'weapon', 'accessory'] },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },

    // --- RPG character stats ---
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    gold: { type: Number, default: 20 }, // small starting gold
    hp: { type: Number, default: 100 },
    maxHp: { type: Number, default: 100 },
    streak: { type: Number, default: 0 },
    lastCompletedDate: { type: Date, default: null }, // for streak calculation

    avatar: {
      base: { type: String, default: 'default_hero' },
      equipped: [equippedItemSchema],
    },

    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next;
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Never send password hash back in API responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;