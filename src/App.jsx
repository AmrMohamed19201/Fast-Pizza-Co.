import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Cart from "./features/cart/Cart";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Order, { loader as orderLoader } from "./features/order/Order";
import { action as updateOrderAction } from "./features/order/UpdateOrder";
import CreateOrder, {
  action as CreateOrderAction,
} from "./features/order/CreateOrder";

import Home from "./ui/Home";
import Error from "./ui/Error";
import AppLayout from "./ui/AppLayout";
//using this method to implement app routing to also let react router control fetching data by using (render as you fetch approach) instead of (fetch on render approach) using useEffects(cause data loading waterfalls)
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />, //handling error using react router
    children: [
      {
        element: <Home />,
        path: "/",
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
        action: CreateOrderAction, //call this function once user submit a form in this route
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
        action: updateOrderAction, //can connect action function with this component in this route or any other child component (such as updateOrder in this case)
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
