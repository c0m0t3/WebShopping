import { Request, Response } from 'express';

// Add an item to a shopping list
export const addItemToShoppingList = async (req: Request, res: Response) => {
    const { shoppingListId } = req.params;
    const { name, description, quantity, purchased } = req.body;
    // Example: Add the item to the shopping list in the database
    res.status(201).json({ message: `Item added to shopping list ${shoppingListId}` });
};

// Remove an item from a shopping list
export const removeItemFromShoppingList = async (req: Request, res: Response) => {
    const { shoppingListId, itemId } = req.params;
    // Example: Remove the item from the shopping list in the database
    res.json({ message: `Item ${itemId} removed from shopping list ${shoppingListId}` });
};