import { useApiClient } from "../adapter/api/useApiClient.ts";
import { BaseLayout } from "../layout/BaseLayout.tsx";
import { Box, Button, Input, Select, useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { CreateShoppingListModal } from "./components/CreateShoppingListModal.tsx";
import { Item, ShoppingList } from "../adapter/api/__generated";
import { ShoppingListTable } from "./components/ShoppingListEntryTable.tsx";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toastUtils.ts";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const HomePage = () => {
  const { isOpen, onOpen, onClose: originalOnClose } = useDisclosure();
  const client = useApiClient();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [filteredLists, setFilteredLists] = useState<ShoppingList[]>([]);
  const [listToBeUpdated, setListToBeUpdated] = useState<ShoppingList | null>(
    null,
  );
  const [searchType, setSearchType] = useState("name");
  const [searchName, setSearchName] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [searchStore, setSearchStore] = useState("");
  const [allItems, setAllItems] = useState<Item[]>([]);
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
    const fetchAllItems = async () => {
      try {
        const response = await client.getItems();
        setAllItems(response.data);
      } catch (err) {
        console.error("Failed to fetch all items", err);
      }
    };
    fetchAllItems();
  }, [onLoadData, client]);

  const onCreateList = async (data: any) => {
    try {
      await client.createShoppingList(data);
      await onLoadData();
      originalOnClose();
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        showToast(
          "Failed to create shopping list, a name is required",
          "error",
        );
      } else if (err.response && err.response.status === 409) {
        showToast(
          "Failed to create shopping list, a name is already in use",
          "error",
        );
      } else {
        showToast("Failed to create shopping list", "error");
      }
      console.error("Failed to create shopping list", err);
    }
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
      try {
        await client.updateShoppingList(listToBeUpdated.id, updateData);
        await onLoadData();
        originalOnClose();
        setListToBeUpdated(null);
      } catch (err: any) {
        if (err.response && err.response.status === 400) {
          showToast(
            "Failed to update shopping list, a name is required",
            "error",
          );
        } else {
          showToast("Failed to update shopping list", "error");
        }
        console.error("Failed to update shopping list", err);
      }
    }
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

  const handleSearchItem = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSearchItem(value);
    if (value) {
      try {
        const response = await client.searchShoppingListsByItem(value);
        const listIds = response.data
          .map((item: { shoppingListId?: string }) => item.shoppingListId)
          .filter((id): id is string => id !== undefined);
        const filtered = lists.filter((list) => listIds.includes(list.id));
        setFilteredLists(filtered);
      } catch (err) {
        const error = err as { response?: { status?: number } };
        if (error.response && error.response.status === 404) {
          setFilteredLists([]);
        } else {
          console.error("Failed to search shopping lists by item", err);
        }
      }
    } else {
      setFilteredLists(lists);
    }
  };

  const handleSearchStore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchStore(value);
    if (value) {
      try {
        const response = await client.searchShoppingListsByStore(value);
        setFilteredLists(response.data);
      } catch (err) {
        console.error("Failed to search shopping lists by store", err);
      }
    } else {
      setFilteredLists(lists);
    }
  };

  return (
    <BaseLayout>
      <Box mb={4} display="flex" justifyContent="space-between">
        <Select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          mr={2}
          width={"auto"}
          minWidth={"7em"}
        >
          <option value="name">Name</option>
          <option value="store">Store</option>
        </Select>
        {searchType === "name" && (
          <Input
            placeholder="Search by name or description"
            value={searchName}
            onChange={handleSearchName}
            mr={2}
          />
        )}
        {searchType === "store" && (
          <Input
            placeholder="Search by store"
            value={searchStore}
            onChange={handleSearchStore}
            mr={2}
          />
        )}
        <Select
          placeholder="Search by item"
          value={searchItem}
          onChange={handleSearchItem}
        >
          {allItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        <Button
          variant={"solid"}
          colorScheme={"blue"}
          onClick={() => {
            onOpen();
          }}
        >
          Create new shopping list
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
      <ToastContainer />
    </BaseLayout>
  );
};
