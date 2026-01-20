import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import store from "../../store";

import { createOrder } from "../../services/apiRestaurant";
import { formatCurrency } from "../../utils/helpers";
import Button from "../../ui/Button";

import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const formErrors = useActionData(); //get action function data to use in component
  const navigation = useNavigation();
  const {
    username,
    address,
    position,
    status: addressStatus,
    error: addressError,
  } = useSelector((state) => state.user);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const dispatch = useDispatch();
  const isSubmitting = navigation.state === "submitting";
  const isLoading = addressStatus === "loading";
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  if (!cart.length) return <EmptyCart />; //can't go to new order page if cart is empty
  return (
    <div className="px-6 py-4">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>
      <Form method="POST">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center mb-5">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input sm:grow"
            defaultValue={username}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center mb-5">
          <label className="sm:basis-40">Phone number</label>
          <div className="sm:grow">
            <input type="tel" name="phone" required className="input w-full" />
            {formErrors?.phone && (
              <p className="rounded-md bg-red-100 text-red-700 text-xs p-2 mt-2">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center mb-5">
          <label className="sm:basis-40">Address</label>
          <div className="sm:grow relative">
            <input
              disabled={isLoading}
              type="text"
              name="address"
              required
              className="input w-full"
              defaultValue={address}
            />
            {!position.latitude && !position.longitude && (
              <span className="absolute right-[3px] top-[3px] z-50 md:right-[5px] md:top-[5px]">
                <Button
                  disabled={isLoading}
                  type="small"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(fetchAddress());
                  }}
                >
                  get geoloaction
                </Button>
              </span>
            )}
            {addressStatus === "error" && (
              <p className="rounded-md bg-red-100 text-red-700 text-xs p-2 mt-2">
                {addressError}
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/*this input field to let formData contain also cart data to place it with user info in order (this way instead of getting redux data in action function)*/}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting
              ? "Placing order..."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}
//this action function called by react router after user submit the form also from react router having a request object as an argument so we can get the data than user fill on form then create order object contain this data then send this order to api by create order function and wait to get this new order from api which has unique id of order so we can redirect to this order page (can't use useNavigate hook because this is not component so react router give us redirect method)
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true", //true is value of state withPriority
  };
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "please give us your correct phone number. We might need to contact you";
  if (Object.keys(errors).length > 0) return errors;
  // if every thing is okay without error , create new order and redirect to it
  const newOrder = await createOrder(order);
  //this way of dispatching because in this action function (not component can not use useDispatch hook) but mustn't overuse this way bacause of performance optimization
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}
export default CreateOrder;
