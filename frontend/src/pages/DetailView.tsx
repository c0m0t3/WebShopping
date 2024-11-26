import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApiClient } from "../adapter/api/useApiClient";
import { Item, ItemToShoppingList } from "../adapter/api/__generated";

export const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const client = useApiClient();
  const [items, setItems] = useState<(Item & ItemToShoppingList)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      if (id) {
        try {
          const response = await client.getItemsForShoppingList(id); // Fetches relation
          const itemDetails = await Promise.all(
            (response.data as ItemToShoppingList[]).map(
              async (item: ItemToShoppingList) => {
                const itemResponse = await client.getItemById(item.itemId); // Fetches item details
                return { ...item, ...itemResponse.data } as Item &
                  ItemToShoppingList;
              },
            ),
          );
          setItems(itemDetails);
        } catch (err) {
          setError("Failed to fetch items");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid shopping list ID");
        setLoading(false);
      }
    };

    fetchItems();
  }, [id, client]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Items in Shopping List</h1>
      <ul>
        {items.map((item) => (
          <li key={item.itemId}>
            <p>Item ID: {item.itemId}</p>
            <p>Name: {item.name}</p>
            <p>Description: {item.description}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Purchased: {item.isPurchased ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetailView;
