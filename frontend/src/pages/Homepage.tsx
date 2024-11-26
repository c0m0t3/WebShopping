import { useApiClient } from "../adapter/api/useApiClient.ts";
import { BaseLayout } from "../layout/BaseLayout.tsx";
import { Box, Button, Input, useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { CreateShoppingListModal } from "./components/CreateShoppingListModal.tsx";
import { ShoppingList } from "../adapter/api/__generated";
import { ShoppingListTable } from "./components/ShoppingListEntryTable.tsx";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const { isOpen, onOpen, onClose: originalOnClose } = useDisclosure();
  const client = useApiClient();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [filteredLists, setFilteredLists] = useState<ShoppingList[]>([]);
  const [listToBeUpdated, setListToBeUpdated] = useState<ShoppingList | null>(
    null,
  );
  const [searchName, setSearchName] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const navigate = useNavigate();

  const onLoadData = useCallback(async () => {
    const res = await client.getShoppingLists();
    if (res && res.data) {
      setLists(res.data);
      setFilteredLists(res.data);
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

  const handleSearchName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value);
    if (value) {
      try {
        const response = await client.searchShoppingLists(value);
        setFilteredLists(response.data);
      } catch (err) {
        console.error("Failed to search shopping lists by name", err);
      }
    } else {
      setFilteredLists(lists);
    }
  };

  const handleSearchItem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchItem(value);
    if (value) {
      try {
        const response = await client.searchShoppingListsByItem(value);
        setFilteredLists(response.data);
      } catch (err) {
        console.error("Failed to search shopping lists by item", err);
      }
    } else {
      setFilteredLists(lists);
    }
  };

  return (
    <BaseLayout>
      <Box mb={4} display="flex" justifyContent="space-between">
        <Input
          placeholder="Search by list name"
          value={searchName}
          onChange={handleSearchName}
          mr={2}
        />
        <Input
          placeholder="Search by item name"
          value={searchItem}
          onChange={handleSearchItem}
        />
      </Box>
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
          data={filteredLists}
          onClickDeleteList={onDeleteShoppingList}
          onClickUpdateList={onClickUpdateShoppingList}
          onClickViewDetails={onClickViewDetails}
        />
      </Box>
    </BaseLayout>
  );
};
