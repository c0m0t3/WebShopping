import { useEffect, useState } from "react";
import { AllItemsEntryTable } from "./components/AllItemsEntryTable";
import { Item } from "../adapter/api/__generated";
import { BaseLayout } from "../layout/BaseLayout";
import { useApiClient } from "../adapter/api/useApiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ItemPage = () => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const client = useApiClient();

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await client.getItems();
        setAllItems(response.data);
      } catch (err) {
        setError("Failed to fetch all items");
      }
    };

    fetchAllItems();
  }, [client]);

  const handleUpdate = async (itemId: string, changes: Partial<Item>) => {
    const { name, description } = changes;
    const filteredChanges = { name, description };

    try {
      await client.updateItem(itemId, filteredChanges);
      const response = await client.getItems();
      setAllItems(response.data);
    } catch (err) {
      setError("Failed to update item");
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await client.deleteItem(itemId);
      console.log("Deleted item", itemId);
      const response = await client.getItems();
      setAllItems(response.data);
    } catch (err) {
      const error = err as { response?: { status?: number } };
      if (error.response && error.response.status === 409) {
        toast.warn(
          "Item is associated with a shopping list and cannot be deleted",
        );
      } else {
        setError("Failed to delete item");
      }
    }
  };

  const handleAdd = async (items: Partial<Item>[]) => {
    try {
      console.log("Adding items", items);
      await client.createItem(items);
      const response = await client.getItems();
      setAllItems(response.data);
    } catch (err) {
      const error = err as { response?: { status?: number } };
      if (error.response && error.response.status === 409) {
        toast.warn("An item with the same name already exists");
      } else {
        setError("Failed to add items");
      }
    }
  };

  return (
    <BaseLayout>
      {error && <div>{error}</div>}
      {!error && (
        <AllItemsEntryTable
          items={allItems}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      )}
      <ToastContainer />
    </BaseLayout>
  );
};

export default ItemPage;
