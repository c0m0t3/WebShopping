import * as React from "react";
import { BaseLayout, BaseLayoutProps } from "./BaseLayout";
import { NavColorModeToggle } from "./ColorModeToggle";
import { NavItem, NavLink } from "./Nav";

const HeaderMenu: React.FC = () => (
  <NavItem>
    <NavLink>Home</NavLink>
  </NavItem>
);

const headerRightMenu = (
  <NavItem>
    <NavColorModeToggle display="inline" />
  </NavItem>
);

export type AppLayoutProps = BaseLayoutProps;

export const AppLayout: React.FC<AppLayoutProps> = (props) => (
  <BaseLayout
    headerMenu={<HeaderMenu />}
    headerRightMenu={headerRightMenu}
    {...props}
  />
);
