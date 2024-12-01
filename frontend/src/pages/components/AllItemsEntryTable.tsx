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
  onAdd: (items: Partial<Item>[]) => void;
}

export const AllItemsEntryTable: React.FC<AllItemsEntryTableProps> = ({
  items = [],
  onUpdate,
  onDelete,
  onAdd,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItems, setSelectedItems] = useState<Partial<Item>[]>([
    { name: "", description: "" },
  ]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAddItem = () => {
    onAdd(selectedItems);
    setSelectedItems([{ name: "", description: "" }]);
    onClose();
  };

  const handleEditItem = (item: Item) => {
    setSelectedItems([item]);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedItems[0].id) {
      onUpdate(selectedItems[0].id, selectedItems[0]);
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
        Add Items
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Items</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedItems.map((item, index) => (
              <div key={index}>
                <Input
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) =>
                    setSelectedItems(
                      selectedItems.map((itm, idx) =>
                        idx === index ? { ...itm, name: e.target.value } : itm,
                      ),
                    )
                  }
                  mb={3}
                />
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    setSelectedItems(
                      selectedItems.map((itm, idx) =>
                        idx === index
                          ? { ...itm, description: e.target.value }
                          : itm,
                      ),
                    )
                  }
                  mb={3}
                />
              </div>
            ))}
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
              value={selectedItems[0].name || ""}
              onChange={(e) =>
                setSelectedItems([
                  { ...selectedItems[0], name: e.target.value },
                ])
              }
              mb={3}
            />
            <Input
              placeholder="Description"
              value={selectedItems[0].description || ""}
              onChange={(e) =>
                setSelectedItems([
                  { ...selectedItems[0], description: e.target.value },
                ])
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
