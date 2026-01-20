import { useLoaderData } from "react-router-dom";

import { getMenu } from "../../services/apiRestaurant";

import MenuItem from "./MenuItem";

function Menu() {
  //provide menu data to Menu component
  const menu = useLoaderData();
  return (
    <ul className="divide-y divide-stone-200 px-2 ">
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

//loader function for fetching menu data from api
export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
