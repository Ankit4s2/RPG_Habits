/**
 * Run with: node utils/seedItems.js
 * Populates the shop with some starter items. Safe to re-run — it clears
 * the Item collection first.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');
 
const starterItems = [
  { name: 'Wooden Sword', slot: 'weapon', cost: 15, minLevel: 1, icon: '🗡️' },
  { name: 'Leather Armor', slot: 'body', cost: 20, minLevel: 1, icon: '🥋' },
  { name: 'Novice Hat', slot: 'head', cost: 10, minLevel: 1, icon: '🎩' },
  { name: 'Lucky Charm', slot: 'accessory', cost: 30, minLevel: 2, icon: '🍀' },
  { name: 'Steel Sword', slot: 'weapon', cost: 60, minLevel: 5, icon: '⚔️' },
  { name: 'Knight Armor', slot: 'body', cost: 80, minLevel: 5, icon: '🛡️' },
  { name: 'Wizard Hat', slot: 'head', cost: 50, minLevel: 4, icon: '🧙' },
  { name: 'Dragon Amulet', slot: 'accessory', cost: 150, minLevel: 10, icon: '💎' },
];
 
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Item.deleteMany({});
  await Item.insertMany(starterItems);
  console.log(`Seeded ${starterItems.length} items`);
  await mongoose.disconnect();
}
 
seed().catch((err) => {
  console.error(err);
  process.exit(1);
});