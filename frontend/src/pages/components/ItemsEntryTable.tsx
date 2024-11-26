import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  MinusIcon,
} from "@chakra-ui/icons";
import { Item, ItemToShoppingList } from "../../adapter/api/__generated";

interface ItemsEntryTableProps {
  items: (Item & Partial<ItemToShoppingList>)[];
  allItems: Item[];
  showDetails?: boolean;
  onUpdate?: (itemId: string, changes: Partial<ItemToShoppingList>) => void;
  onDelete?: (itemId: string) => void;
  onAdd?: (itemId: string) => void;
}

export const ItemsEntryTable: React.FC<ItemsEntryTableProps> = ({
  items,
  allItems,
  showDetails = false,
  onUpdate,
  onDelete,
  onAdd,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleUpdate = (
    itemId: string,
    changes: Partial<ItemToShoppingList>,
  ) => {
    if (onUpdate) {
      onUpdate(itemId, changes);
    }
  };

  const handleAddItem = () => {
    if (selectedItemId && onAdd) {
      onAdd(selectedItemId);
      onClose();
    }
  };

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            {showDetails && <Th>Quantity</Th>}
            {showDetails && <Th>Purchased</Th>}
            {showDetails && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item.id}>
              <Td>{item.name}</Td>
              <Td>{item.description}</Td>
              {showDetails && (
                <Td>
                  <IconButton
                    aria-label="Decrease quantity"
                    icon={<MinusIcon />}
                    size="sm"
                    onClick={() => {
                      if (item.id) {
                        handleUpdate(item.id, {
                          quantity: Math.max((item.quantity || 0) - 1, 1),
                        });
                      }
                    }}
                  />
                  <Box as="span" mx="2">
                    {item.quantity}
                  </Box>
                  <IconButton
                    aria-label="Increase quantity"
                    icon={<AddIcon />}
                    size="sm"
                    onClick={() => {
                      if (item.id) {
                        handleUpdate(item.id, {
                          quantity: (item.quantity || 0) + 1,
                        });
                      }
                    }}
                  />
                </Td>
              )}
              {showDetails && (
                <Td>
                  {item.is_purchased ? "Yes" : "No"}
                  <IconButton
                    aria-label={
                      item.is_purchased
                        ? "Unmark as purchased"
                        : "Mark as purchased"
                    }
                    icon={item.is_purchased ? <CloseIcon /> : <CheckIcon />}
                    size="sm"
                    onClick={() => {
                      if (item.id) {
                        handleUpdate(item.id, {
                          is_purchased: !item.is_purchased,
                        });
                      }
                    }}
                    ml="2"
                  />
                </Td>
              )}
              {showDetails && (
                <Td>
                  <IconButton
                    aria-label="Delete item"
                    icon={<DeleteIcon />}
                    size="sm"
                    onClick={() => {
                      if (item.id) {
                        onDelete && onDelete(item.id);
                      }
                    }}
                  />
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="teal"
        variant="solid"
        onClick={onOpen}
        mt="4"
      >
        Add Item
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Item to Add</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Select item"
              onChange={(e) => setSelectedItemId(e.target.value)}
            >
              {allItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddItem}>
              Add
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
