import { useEffect, useState } from "react";
import axios from "axios";

interface ShoppingList {
  id: number;
  name: string;
  description: string;
}

export const ShoppingListsView = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const response = await axios.get("/api/shopping-lists");
        setShoppingLists(response.data);
      } catch (error) {
        console.error("Failed to fetch shopping lists", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingLists();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Shopping Lists</h1>
      <ul>
        {shoppingLists.map((list) => (
          <li key={list.id}>
            <h2>{list.name}</h2>
            <p>{list.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingListsView;
