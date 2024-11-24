import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
// Ensure the correct path to HomePage
import { ShoppingListsView } from "./pages/ListView";

export type RouteConfig = RouteProps & {
  /**
   * Required route path. E.g. /home
   */
  path: string;
  isPrivate?: boolean;
};

export const routes: RouteConfig[] = [
  {
    isPrivate: true,
    path: "/",
    element: <Navigate to="/home" replace />,
    index: true,
  },
  {
    isPrivate: true,
    path: "/home",
    element: <ShoppingListsView />,
  },
];

export function renderRouteMap({
  isPrivate,
  element,
  ...restRoute
}: RouteConfig) {
  return <Route key={restRoute.path} {...restRoute} element={element} />;
}

export const AppRoutes = () => {
  return <Routes>{routes.map(renderRouteMap)}</Routes>;
};
