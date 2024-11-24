import * as React from "react";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { AppHeader } from "./AppHeader";
import { Page } from "./Page";

export interface BaseLayoutProps extends Omit<BoxProps, "title"> {
  headerMenu?: React.ReactNode;
  headerRightMenu?: React.ReactNode;
  hasScrollContainer?: boolean;
}

export const BaseLayout = (props: BaseLayoutProps) => {
  const { headerMenu, headerRightMenu, hasScrollContainer, ...restProps } =
    props;

  return (
    <Box
      display="flex"
      flexDirection="column"
      bg="gray.200"
      _dark={{ bg: "initial" }}
      css={
        hasScrollContainer
          ? { height: "100vh", overflow: "hidden" }
          : { minHeight: "100vh" }
      }
      {...restProps}
    >
      <AppHeader menuEntries={headerMenu} menuRightEntries={headerRightMenu} />
      <Flex flex={1} flexDirection="row" mt="g" overflow="hidden">
        <Flex flex={1} direction="column" overflow="hidden">
          <Page {...restProps} />
        </Flex>
      </Flex>
    </Box>
  );
};
