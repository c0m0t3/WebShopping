import { Request, Response } from 'express';
import { pool } from '../db';

// Retrieve all shopping lists
export const getAllShoppingLists = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM shopping_lists');
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving shopping lists:', err);
        res.status(500).json({ error: 'Error retrieving shopping lists' });
    }
};

// Create a new shopping list
export const createShoppingList = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO shopping_lists (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating shopping list:', err);
        res.status(500).json({ error: 'Error creating shopping list' });
    }
};

// Update a shopping list
export const updateShoppingList = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE shopping_lists SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Error updating shopping list ${id}:`, err);
        res.status(500).json({ error: `Error updating shopping list ${id}` });
    }
};

// Delete a shopping list
export const deleteShoppingList = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM shopping_lists WHERE id = $1', [id]);
        res.json({ message: `Shopping list ${id} deleted` });
    } catch (err) {
        console.error(`Error deleting shopping list ${id}:`, err);
        res.status(500).json({ error: `Error deleting shopping list ${id}` });
    }
};

// Search shopping lists
export const searchShoppingLists = async (req: Request, res: Response) => {
    const { query } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM shopping_lists WHERE name ILIKE $1 OR description ILIKE $1',
            [`%${query}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error searching shopping lists:', err);
        res.status(500).json({ error: 'Error searching shopping lists' });
    }
};

// Retrieve shopping lists containing a specific item
export const getShoppingListsByItem = async (req: Request, res: Response) => {
    const { itemId } = req.params;
    try {
        const result = await pool.query(
            'SELECT sl.* FROM shopping_lists sl JOIN shopping_list_items sli ON sl.id = sli.shopping_list_id WHERE sli.item_id = $1',
            [itemId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(`Error retrieving shopping lists with item ${itemId}:`, err);
        res.status(500).json({ error: `Error retrieving shopping lists with item ${itemId}` });
    }
};