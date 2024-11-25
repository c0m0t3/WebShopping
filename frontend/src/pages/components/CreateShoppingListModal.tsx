import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { InputControl, SubmitButton, TextareaControl } from "formik-chakra-ui";
import { ShoppingList } from "../../adapter/api/__generated";
import ReactSelectControl from "../../components/ReactSelectControl";
import { GroupBase } from "react-select";
import { useApiClient } from "../../adapter/api/useApiClient";
import { OptionBase } from "chakra-react-select";

interface ItemOption extends OptionBase {
  id?: string;
  label: string;
  value: string;
}

type List = Omit<ShoppingList, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<ShoppingList, "id">> & {
    items: ItemOption[];
  };

export const CreateShoppingListModal = ({
  initialValues,
  onSubmit,
  ...restProps
}: Omit<ModalProps, "children"> & {
  initialValues: List | null;
  onSubmit?: (data: List) => void;
}) => {
  const client = useApiClient();

  return (
    <Modal {...restProps}>
      <ModalOverlay />
      <Formik<List>
        initialValues={
          initialValues ?? { name: "", description: "", store: "", items: [] }
        }
        onSubmit={(values, formikHelpers: FormikHelpers<List>) => {
          console.log("submit");
          onSubmit?.(values);
          formikHelpers.setSubmitting(false);
        }}
      >
        <ModalContent as={Form}>
          <ModalHeader>
            {initialValues
              ? "Einkaufsliste bearbeiten"
              : "Einkaufsliste erstellen"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <InputControl name="name" label="Name" />
              <TextareaControl name="description" label="Beschreibung" />
              <InputControl name="store" label="Geschäft" />
              <ReactSelectControl<ItemOption, true, GroupBase<ItemOption>>
                name="items"
                label="Artikel"
                selectProps={{
                  isMulti: true,
                  defaultOptions: true,
                  loadOptions: async () => {
                    const response = await client.getShoppingLists();
                    console.log(response);
                    if (response && response.status === 200) {
                      return response.data.map((item: ShoppingList) => ({
                        id: item.id,
                        label: item.name ?? "",
                        value: item.name ?? "",
                      }));
                    }
                    return [];
                  },
                }}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <SubmitButton>
              {initialValues ? "Liste bearbeiten" : "Liste erstellen"}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Formik>
    </Modal>
  );
};
