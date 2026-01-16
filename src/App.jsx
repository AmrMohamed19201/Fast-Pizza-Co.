import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./ui/Home";
import Error from "./ui/Error";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Order from "./features/order/Order";
import CreateOrder from "./features/order/CreateOrder";
import AppLayout from "./ui/AppLayout";
//using this method to implement app routing to also let react router control fetching data by using (render as you fetch approach) instead of (fetch on render approach) using useEffects(cause data loading waterfalls)
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />, //handling error using react router
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader, //connect menu loader function to menu route
        errorElement: <Error />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
      },
      {
        path: "/order/:orderId",
        element: <Order />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
