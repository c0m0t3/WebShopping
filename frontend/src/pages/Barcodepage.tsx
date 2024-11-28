// frontend/src/pages/Barcodepage.tsx
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
import { showToast } from "../utils/toastUtils";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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
      const response = await client.getProductByBarcode(barcode);
      const { product_name, product_type } = response.data;
      if (!product_name) {
        showToast("No name and type found for the given barcode.", "warn");
      }
      setItemData({
        name: product_name ?? "",
        description: product_type ?? "",
      });
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        showToast("Barcode not found.", "error");
      } else {
        console.error("Failed to search item by barcode", err);
        showToast("Failed to search item by barcode", "error");
      }
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
              size="lg"
              width={"30em"}
            />
            <Center mt={2}>
              <Button onClick={handleSearchBarcode} width={"30em"}>
                Search
              </Button>
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
      <ToastContainer />
    </BaseLayout>
  );
};

export default BarcodePage;
