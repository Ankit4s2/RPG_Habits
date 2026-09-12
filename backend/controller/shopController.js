import Item from "../model/Item.js";

export const getShopItems = async (req, res)=>{
   const items = await Item.find().sort({ cost: 1 });
    res.json({ items }); 
}

export const buyItem = async (req, res)=>{

    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    const user = req.user;
    
    if (user.level < item.minLevel) {
        return res.status(400).json({ message: `Requires level ${item.minLevel}` });
    }
    if (user.inventory.includes(item._id)) {
        return res.status(400).json({ message: 'Item already owned' });
    }
    if (user.gold < item.cost) {
        return res.status(400).json({ message: 'Not enough gold' });
    }
    
    user.gold -= item.cost;
    user.inventory.push(item._id);
    await user.save();
    
    res.json({ message: 'Item purchased', user, item });
}

export const equipItem = async (req, res)=>{
    
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    const user = req.user;
    if (!user.inventory.includes(item._id)) {
        return res.status(400).json({ message: 'You do not own this item' });
    }
    
    // Remove any item currently in the same slot, then equip the new one
    user.avatar.equipped = user.avatar.equipped.filter((e) => e.slot !== item.slot);
    user.avatar.equipped.push({ item: item._id, slot: item.slot });
    
    await user.save();
    res.json({ message: 'Item equipped', user });
}