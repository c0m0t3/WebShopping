import { IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { ShoppingList } from "../../adapter/api/__generated";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

interface ShoppingListTableProps {
  data: ShoppingList[];
  onClickDeleteList: (list: ShoppingList) => void;
  onClickUpdateList: (list: ShoppingList) => void;
  onClickViewDetails: (list: ShoppingList) => void;
}

export const ShoppingListTable = ({
  data,
  onClickDeleteList,
  onClickUpdateList,
  onClickViewDetails,
}: ShoppingListTableProps) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Description</Th>
          <Th>Store</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((list) => (
          <Tr
            key={list.id}
            style={{ cursor: "pointer" }}
            onClick={() => onClickViewDetails(list)}
          >
            <Td>{list.name}</Td>
            <Td>{list.description}</Td>
            <Td>{list.store}</Td>
            <Td onClick={(e) => e.stopPropagation()}>
              <IconButton
                aria-label="Edit list"
                icon={<EditIcon />}
                onClick={() => onClickUpdateList(list)}
              />
              <IconButton
                aria-label="Delete list"
                icon={<DeleteIcon />}
                onClick={() => onClickDeleteList(list)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
