import { Box, chakra, HTMLChakraProps } from "@chakra-ui/react";
import React, { forwardRef } from "react";

// Navigation Container
export const Nav = forwardRef<HTMLUListElement, HTMLChakraProps<"ul">>(
  (props, ref) => (
    <chakra.ul role="menu" flex={1} ref={ref} display="flex" {...props} />
  ),
);

// Navigation Item
export const NavItem = forwardRef<HTMLLIElement, HTMLChakraProps<"li">>(
  (props, ref) => (
    <chakra.li listStyleType="none" role="none" ref={ref} {...props} />
  ),
);

// Navigation Button Props
export interface NavButtonProps extends HTMLChakraProps<"button"> {
  icon?: React.ReactNode;
}

// Navigation Button
export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ icon, children, ...props }, ref) => {
    return (
      <chakra.button ref={ref} {...props}>
        {icon} {children}
      </chakra.button>
    );
  },
);

// Navigation Link Props
export interface NavLinkProps extends HTMLChakraProps<"a"> {}

// Navigation Link
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ children, ...linkProps }, ref) => {
    return (
      <chakra.a ref={ref} {...linkProps}>
        <Box>{children}</Box>
      </chakra.a>
    );
  },
);
