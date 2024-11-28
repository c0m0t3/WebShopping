import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useApiClient } from "../adapter/api/useApiClient";
import { BaseLayout } from "../layout/BaseLayout";

const BarcodePage = () => {
  const client = useApiClient();
  const [barcode, setBarcode] = useState("");
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
  });

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleSearchBarcode = async () => {
    try {
      if (!barcode) {
        throw new Error("Barcode is required");
      }
      console.log("Searching barcode", barcode);
      const response = await client.getProductByBarcode(barcode);
      const { product_name, product_type } = response.data;
      setItemData({
        name: product_name ?? "",
        description: product_type ?? "",
      });
    } catch (err) {
      console.error("Failed to search item by barcode", err);
    }
  };

  const handleCreateItem = async () => {
    try {
      await client.createItem([itemData]);
      alert("Item created successfully!");
    } catch (err) {
      console.error("Failed to create item", err);
    }
  };

  return (
    <BaseLayout>
      <Center>
        <Box>
          <FormControl>
            <Input
              value={barcode}
              onChange={handleBarcodeChange}
              placeholder="Enter barcode"
              size="lg" // Make the input larger
            />
            <Center mt={2}>
              <Button onClick={handleSearchBarcode}>Search</Button>
            </Center>
          </FormControl>
          {itemData.name && (
            <Box mt={4}>
              <FormControl>
                <FormLabel>Item Name</FormLabel>
                <Input
                  value={itemData.name}
                  onChange={(e) =>
                    setItemData({ ...itemData, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>Item Description</FormLabel>
                <Input
                  value={itemData.description}
                  onChange={(e) =>
                    setItemData({ ...itemData, description: e.target.value })
                  }
                />
              </FormControl>
              <Button onClick={handleCreateItem} mt={4}>
                Create Item
              </Button>
            </Box>
          )}
        </Box>
      </Center>
    </BaseLayout>
  );
};

export default BarcodePage;
