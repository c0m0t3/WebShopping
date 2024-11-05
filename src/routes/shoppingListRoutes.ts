import { Router } from 'express';
import {
    getAllShoppingLists,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    searchShoppingLists,
    getShoppingListsByItem
} from '../controllers/shoppingListController';

const router = Router();

router.get('/', getAllShoppingLists);
router.post('/', createShoppingList);
router.put('/:id', updateShoppingList);
router.delete('/:id', deleteShoppingList);
router.get('/search', searchShoppingLists);
router.get('/by-item/:itemId', getShoppingListsByItem);

export default router;