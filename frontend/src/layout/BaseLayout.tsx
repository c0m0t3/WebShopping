import {
  Box,
  Button,
  chakra,
  HStack,
  Icon,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaBarcode } from "react-icons/fa";
import { MouseEventHandler } from "react";
import { Link, useLocation } from "react-router-dom";

const ColorModeToggle = () => {
  const { toggleColorMode } = useColorMode();

  const icon = useColorModeValue(<MoonIcon />, <SunIcon />);
  const onClickToggle: MouseEventHandler<HTMLButtonElement> = () => {
    toggleColorMode();
    console.log("Toggle Color Mode");
  };
  return <Button onClick={onClickToggle}>{icon}</Button>;
};

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isOnItemsPage = location.pathname === "/items";
  const isOnBarcodePage = location.pathname === "/barcode";
  const isOnDetailView = location.pathname.startsWith("/detail/");

  let pageTitle = "Home";
  if (isOnItemsPage) {
    pageTitle = "Items";
  } else if (isOnBarcodePage) {
    pageTitle = "Barcode";
  } else if (isOnDetailView) {
    pageTitle = "Shopping List Details";
  }

  return (
    <Box
      bg={"gray.200"}
      _dark={{ bg: "gray.800" }}
      minH={"100vh"}
      display={"flex"}
      flexDirection={"column"}
    >
      <HStack p={4} bg={"teal.400"}>
        <a href={"/"}>FWE 24/25</a>
        <Box flex={1} textAlign="center" fontWeight="bold">
          {pageTitle}
        </Box>
        <Box gap={4} display={"flex"}>
          <Link to={isOnItemsPage ? "/" : "/items"}>
            <Button>{isOnItemsPage ? "ShoppingList" : "Items"}</Button>
          </Link>
          <Link to="/barcode">
            <Button leftIcon={<Icon as={FaBarcode} />}>Barcode</Button>
          </Link>
          <ColorModeToggle />
        </Box>
      </HStack>
      <chakra.main
        flex={1}
        px={4}
        py={8}
        overflowX="hidden"
        display="flex"
        flexDirection="column"
        ml="auto"
        mr="auto"
        maxWidth="90rem"
        width="100%"
      >
        {children}
      </chakra.main>
    </Box>
  );
};
