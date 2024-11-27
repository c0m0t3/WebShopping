import { useEffect, useState } from "react";
import { AllItemsEntryTable } from "./components/AllItemsEntryTable";
import { Item } from "../adapter/api/__generated";
import { BaseLayout } from "../layout/BaseLayout";
import { useApiClient } from "../adapter/api/useApiClient";

const ItemPage = () => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const client = useApiClient();

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await client.getItems();
        console.log("Fetch all items response", response);
        setAllItems(response.data);
      } catch (err) {
        setError("Failed to fetch all items");
      }
    };

    fetchAllItems();
  }, [client]);

  return (
    <BaseLayout>
      {error && <div>{error}</div>}
      {!error && (
        <AllItemsEntryTable
          items={allItems}
          onUpdate={(itemId: string) => console.log(`Update item ${itemId}`)}
          onDelete={(itemId: string) => console.log(`Delete item ${itemId}`)}
          onAdd={(itemId: string) => console.log(`Add item ${itemId}`)}
        />
      )}
    </BaseLayout>
  );
};

export default ItemPage;
