import { useApiClient } from "../adapter/api/useApiClient.ts";
import { BaseLayout } from "../layout/BaseLayout.tsx";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { CreateShoppingListModal } from "./components/CreateShoppingListModal.tsx";
import { ShoppingList } from "../adapter/api/__generated";
import { ShoppingListTable } from "./components/ShoppingListEntryTable.tsx";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const { isOpen, onOpen, onClose: originalOnClose } = useDisclosure();
  const client = useApiClient();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [listToBeUpdated, setListToBeUpdated] = useState<ShoppingList | null>(
    null,
  );
  const navigate = useNavigate();

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
    await client.createShoppingList(data);
    await onLoadData();
    originalOnClose();
  };

  const onDeleteShoppingList = async (list: ShoppingList) => {
    await client.deleteShoppingList(list.id);
    await onLoadData();
    setListToBeUpdated(null);
  };

  const onClickUpdateShoppingList = async (list: ShoppingList) => {
    setListToBeUpdated(list);
    onOpen();
  };

  const onUpdateShoppingList = async (list: any) => {
    if (listToBeUpdated?.id) {
      const { id, createdAt, updatedAt, items, ...updateData } = list;
      await client.updateShoppingList(listToBeUpdated.id, updateData);
    }
    await onLoadData();
    originalOnClose();
    setListToBeUpdated(null);
  };

  const onClose = () => {
    setListToBeUpdated(null);
    originalOnClose();
  };

  const onClickViewDetails = (list: ShoppingList) => {
    navigate(`/detail/${list.id}`);
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
          onClickViewDetails={onClickViewDetails}
        />
      </Box>
    </BaseLayout>
  );
};
