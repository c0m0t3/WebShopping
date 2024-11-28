import { useApiClient } from "../adapter/api/useApiClient.ts";
import { BaseLayout } from "../layout/BaseLayout.tsx";
import { Box, Button, Input, Select, useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { CreateShoppingListModal } from "./components/CreateShoppingListModal.tsx";
import { Item, ShoppingList } from "../adapter/api/__generated";
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
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
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

  const handleSearch = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      try {
        let response;
        if (searchType === "name") {
          response = await client.searchShoppingLists(value);
        } else {
          response = await client.searchShoppingListsByStore(value);
        }
        setFilteredLists(response.data);
      } catch (err) {
        console.error(`Failed to search shopping lists by ${searchType}`, err);
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
          <option value="name"> Name</option>
          <option value="store"> Store</option>
        </Select>
        <Input
          placeholder={`Search by ${searchType}`}
          value={searchValue}
          onChange={handleSearch}
          mr={2}
        />
        <Select
          placeholder="Search by item"
          value={searchValue}
          onChange={handleSearch}
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
