import { Router } from 'express';
import {
    addItemToShoppingList,
    removeItemFromShoppingList
} from '../controller/itemController';

const router = Router();

router.post('/:shoppingListId', addItemToShoppingList);
router.delete('/:shoppingListId/:itemId', removeItemFromShoppingList);

export default router;