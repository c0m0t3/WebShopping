import React from "react";
import {
  Box,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
  showDetails?: boolean;
  onUpdate?: (itemId: string, changes: Partial<ItemToShoppingList>) => void;
  onDelete?: (itemId: string) => void;
}

export const ItemsEntryTable: React.FC<ItemsEntryTableProps> = ({
  items,
  showDetails = false,
  onUpdate,
  onDelete,
}) => {
  const handleUpdate = (
    itemId: string | undefined,
    changes: Partial<ItemToShoppingList>,
  ) => {
    if (itemId && onUpdate) {
      onUpdate(itemId, changes);
    }
  };

  return (
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
                  onClick={() =>
                    handleUpdate(item.id, {
                      quantity: Math.max((item.quantity || 0) - 1, 1),
                    })
                  }
                />
                <Box as="span" mx="2">
                  {item.quantity}
                </Box>
                <IconButton
                  aria-label="Increase quantity"
                  icon={<AddIcon />}
                  size="sm"
                  onClick={() =>
                    handleUpdate(item.id, {
                      quantity: (item.quantity || 0) + 1,
                    })
                  }
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
                  onClick={() =>
                    handleUpdate(item.id, { is_purchased: !item.is_purchased })
                  }
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
  );
};
