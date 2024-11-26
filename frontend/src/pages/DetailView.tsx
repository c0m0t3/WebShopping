import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApiClient } from "../adapter/api/useApiClient";
import {
  Item,
  ItemOutShoppingList,
  ItemToShoppingList,
  ShoppingList,
} from "../adapter/api/__generated";
import { ItemsEntryTable } from "./components/ItemsEntryTable";
import { BaseLayout } from "../layout/BaseLayout.tsx";
import { Box, Heading, Text } from "@chakra-ui/react";

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>There is no ID</div>;
  }
  const client = useApiClient();
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<(Item & ItemToShoppingList)[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await client.getShoppingListById(id);
        setShoppingList(response.data);
      } catch (err) {
        setError("Failed to fetch shopping list");
      }
    };

    const fetchItems = async () => {
      if (!id) {
        setError("Invalid shopping list ID");
        setLoading(false);
        return;
      }
      try {
        const response = await client.getItemsForShoppingList(id); // Fetches relation
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response data");
        }
        const itemDetails = await Promise.all(
          (response.data as ItemOutShoppingList[]).map(async (item) => {
            if (!item.itemId) {
              throw new Error("Item ID is missing");
            }
            const itemResponse = await client.getItemById(item.itemId); // Fetches item details
            return {
              ...item,
              ...itemResponse.data,
              isPurchased: item.is_purchased,
            } as Item & ItemToShoppingList;
          }),
        );
        setItems(itemDetails);
      } catch (err) {
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllItems = async () => {
      try {
        const response = await client.getItems();
        setAllItems(response.data);
      } catch (err) {
        setError("Failed to fetch all items");
      }
    };

    fetchShoppingList();
    fetchItems();
    fetchAllItems();
  }, [id, client]);

  const handleUpdate = async (
    itemId: string,
    changes: Partial<ItemToShoppingList>,
  ) => {
    const item = items.find((item) => item.id === itemId);
    if (item) {
      const updatedItem = { ...item, ...changes };
      try {
        console.log("Updating item", updatedItem);
        await client.updateItemInShoppingList(id, itemId, {
          is_purchased: updatedItem.is_purchased,
          quantity: updatedItem.quantity,
        });
        setItems((prevItems) =>
          prevItems.map((i) => (i.id === itemId ? updatedItem : i)),
        );
      } catch (err) {
        setError("Failed to update item");
      }
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await client.removeItemFromShoppingList(id, itemId);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  const handleAdd = async (selectedItemId: string) => {
    if (!selectedItemId) {
      setError("No item selected");
      return;
    }
    try {
      const itemsToAdd = [
        {
          itemId: selectedItemId,
          quantity: 1,
          is_purchased: false,
        },
      ];
      await client.addItemToShoppingList(id, { items: itemsToAdd });
      const addedItem = allItems.find((item) => item.id === selectedItemId);
      if (addedItem) {
        setItems((prevItems) => [
          ...prevItems,
          { ...addedItem, quantity: 1, isPurchased: false },
        ]);
      }
    } catch (err) {
      setError("Failed to add item");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <BaseLayout>
      {shoppingList && (
        <Box mb={4} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
          <Heading as="h1" size="lg" mb={2}>
            {shoppingList.name}
          </Heading>
          <Text fontSize="md" color="gray.600">
            {shoppingList.store}
          </Text>
          <Text fontSize="md" color="gray.600">
            {shoppingList.description}
          </Text>
        </Box>
      )}
      <ItemsEntryTable
        items={items}
        allItems={allItems}
        showDetails={true}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </BaseLayout>
  );
};

export default DetailView;
