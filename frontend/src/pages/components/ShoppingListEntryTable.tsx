import { ShoppingList } from "../../adapter/api/__generated";
import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

export const ShoppingListTable = ({
  data,
  onClickDeleteList,
  onClickUpdateList,
}: {
  data: ShoppingList[];
  onClickDeleteList: (shoppingList: ShoppingList) => void;
  onClickUpdateList: (shoppingList: ShoppingList) => void;
}) => {
  return (
    <TableContainer>
      <Table variant="simple">
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
            <Tr key={list.id}>
              <Td>{list.name}</Td>
              <Td>{list.description}</Td>
              <Td>{list.store}</Td>
              <Td>
                <IconButton
                  aria-label="Delete list"
                  icon={<DeleteIcon />}
                  onClick={() => onClickDeleteList(list)}
                />{" "}
                <IconButton
                  aria-label="Edit list"
                  icon={<EditIcon />}
                  onClick={() => onClickUpdateList(list)}
                />{" "}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
