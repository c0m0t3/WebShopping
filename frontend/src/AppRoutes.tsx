import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
import { HomePage } from "./pages/Homepage";
import DetailView from "./pages/DetailView";
import ItemPage from "./pages/Itempage";
import BarcodePage from "./pages/Barcodepage.tsx";

export type RouteConfig = RouteProps & {
  /**
   * Required route path. E.g. /home
   */
  path: string;
  isPrivate?: boolean;
};

export const appRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <Navigate to="/home" replace />,
    index: true,
  },
  {
    isPrivate: true,
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/detail/:id",
    element: <DetailView />,
  },
  {
    path: "/items",
    element: <ItemPage />,
  },
  {
    path: "/barcode",
    element: <BarcodePage />,
  },
];

export function renderRouteMap({ element, ...restRoute }: RouteConfig) {
  return <Route key={restRoute.path} {...restRoute} element={element} />;
}

export const AppRoutes = () => {
  return <Routes>{appRoutes.map(renderRouteMap)}</Routes>;
};
