import { forwardRef } from "react";
import {
  useColorMode,
  useColorModeValue,
} from "../components/ui/color-mode.tsx";
import { NavButton, NavButtonProps } from "./Nav";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const NavColorModeToggle = forwardRef<HTMLButtonElement, NavButtonProps>(
  (props, ref) => {
    const { toggleColorMode } = useColorMode();

    const icon = useColorModeValue(<MoonIcon />, <SunIcon />);
    const label = useColorModeValue(
      "Darkmode aktivieren",
      "Lightmode aktivieren",
    );

    return (
      <NavButton
        icon={icon}
        aria-label={label}
        onClick={toggleColorMode}
        ref={ref}
        {...props}
      />
    );
  },
);
