import * as React from "react";
import { Box, chakra, HStack } from "@chakra-ui/react";
import { Nav } from "./Nav";

export type NavigationProps = {
  menuEntries?: React.ReactNode;
  menuRightEntries?: React.ReactNode;
};

export const AppHeader: React.FC<NavigationProps> = ({
  menuEntries,
  menuRightEntries,
}) => {
  return (
    <HStack as="nav" p={4} bg="cyan.700">
      <chakra.a href={"/"} flex={1}>
        FWE 22
      </chakra.a>
      {menuEntries ? <Nav justifyContent="center">{menuEntries}</Nav> : null}
      {menuRightEntries ? (
        <Nav justifyContent="flex-end">{menuRightEntries}</Nav>
      ) : (
        <Box role="none" flex="1" />
      )}
    </HStack>
  );
};
