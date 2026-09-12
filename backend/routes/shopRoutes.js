import express from "express";
import {
    getShopItems,
    buyItem,
    equipItem,
} from "../controller/shopController.js";
import {auth} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', getShopItems);
router.post('/buy/:itemId', auth, buyItem);
router.post('/equip/:itemId', auth, equipItem);

export default router;