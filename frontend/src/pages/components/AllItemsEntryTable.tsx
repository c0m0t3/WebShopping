import React, { useState } from "react";
import {
  Button,
  IconButton,
  Input,
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
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Item } from "../../adapter/api/__generated";

interface AllItemsEntryTableProps {
  items: Item[];
  onUpdate: (itemId: string, changes: Partial<Item>) => void;
  onDelete: (itemId: string) => void;
  onAdd: (item: Partial<Item>) => void;
}

export const AllItemsEntryTable: React.FC<AllItemsEntryTableProps> = ({
  items = [],
  onUpdate,
  onDelete,
  onAdd,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Partial<Item>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAddItem = () => {
    if (selectedItemId) {
      const item = items.find((item) => item.id === selectedItemId);
      if (item) {
        onAdd(item);
      }
      onClose();
    }
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedItem.id) {
      onUpdate(selectedItem.id, selectedItem);
      setIsEditModalOpen(false);
    }
  };

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item.id}>
              <Td>{item.name}</Td>
              <Td>{item.description}</Td>
              <Td>
                <IconButton
                  aria-label="Edit item"
                  icon={<EditIcon />}
                  size="sm"
                  onClick={() => handleEditItem(item)}
                  mr="2"
                />
                <IconButton
                  aria-label="Delete item"
                  icon={<DeleteIcon />}
                  size="sm"
                  onClick={() => (item.id ? onDelete(item.id) : null)}
                />
              </Td>
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
              {items.map((item) => (
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

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Name"
              value={selectedItem.name || ""}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, name: e.target.value })
              }
              mb={3}
            />
            <Input
              placeholder="Description"
              value={selectedItem.description || ""}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  description: e.target.value,
                })
              }
              mb={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AllItemsEntryTable;
