import { useApiClient } from "../adapter/api/useApiClient.ts";
import { BaseLayout } from "../layout/BaseLayout.tsx";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { CreateShoppingListModal } from "./components/CreateShoppingListModal.tsx";
import { ShoppingList } from "../adapter/api/__generated";
import { ShoppingListTable } from "./components/ShoppingListEntryTable.tsx";

export const HomePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const client = useApiClient();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const onLoadData = useCallback(async () => {
    const res = await client.getShoppingLists();
    if (res && res.data) {
      setLists(res.data);
    }
  }, [client]);
  useEffect(() => {
    onLoadData();
  }, [onLoadData]);
  const onCreateList = async (data: any) => {
    console.log(data);
    await client.createShoppingList(data);
    await onLoadData();
    onClose();
  };

  const onDeleteShoppingList = async (list: ShoppingList) => {
    await client.deleteShoppingList(list.id);
    await onLoadData();
    setListToBeUpdated(null);
  };

  const [listToBeUpdated, setListToBeUpdated] = useState<ShoppingList | null>(
    null,
  );

  const onClickUpdateShoppingList = async (list: ShoppingList) => {
    setListToBeUpdated(list);
    onOpen();
  };

  const onUpdateShoppingList = async (list: any) => {
    if (listToBeUpdated?.id) {
      await client.updateShoppingList(listToBeUpdated.id, list);
    }
    await onLoadData();
    onClose();
    setListToBeUpdated(null);
  };

  return (
    <BaseLayout>
      <Box>
        <Button
          variant={"solid"}
          colorScheme={"blue"}
          onClick={() => {
            onOpen();
          }}
        >
          Neue Einkaufsliste erstellen
        </Button>
        <CreateShoppingListModal
          initialValues={
            listToBeUpdated
              ? {
                  ...listToBeUpdated,
                  items:
                    listToBeUpdated.items?.map((item) => ({
                      id: item.id,
                      label: item.name ?? "",
                      value: item.name ?? "",
                    })) ?? [],
                }
              : null
          }
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={(updatedList) => {
            if (listToBeUpdated) {
              onUpdateShoppingList(updatedList);
            } else {
              onCreateList(updatedList);
            }
          }}
        />
        <ShoppingListTable
          data={lists}
          onClickDeleteList={onDeleteShoppingList}
          onClickUpdateList={onClickUpdateShoppingList}
        />
      </Box>
    </BaseLayout>
  );
};
