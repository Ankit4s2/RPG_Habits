import express from "express";
import {
    getShopItems,
    buyItem,
    equipItem,
} from "../controller/shopController.js";

const router = express.Router();

router.get('/', getShopItems);
router.post('/buy/:itemId', buyItem);
router.post('/equip/:itemId', equipItem);

export default router;