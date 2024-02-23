import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { fetch_products } from "../redux/reducers/product_slice";
import Loader from "../components/Loader";
import {
  create_order,
  delete_order,
  fetch_my_orders,
  update_status,
} from "../redux/reducers/order_slice";
import { error, success } from "../redux/reducers/notification_slice";

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const { products, loading_products } = useSelector((state) => state.product);
  const { loading_create, orders, loading_orders } = useSelector(
    (state) => state.order
  );

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0.0);

  useEffect(() => {
    dispatch(fetch_products());
    dispatch(fetch_my_orders());
  }, []);

  const placeItem = (product) => {
    const itemIndex = items.findIndex((item) => item._id === product._id);

    if (itemIndex !== -1) {
      const updatedItems = [...items];
      updatedItems[itemIndex].quantity += 1;
      setItems(updatedItems);
    } else {
      setItems([...items, { ...product, quantity: 1 }]);
    }

    setTotal(total + parseFloat(product.price));
  };

  const removeItem = (product) => {
    const itemIndex = items.findIndex((item) => item._id === product._id);

    if (itemIndex !== -1) {
      const updatedItems = [...items];
      if (updatedItems[itemIndex].quantity > 1) {
        updatedItems[itemIndex].quantity -= 1;
      } else {
        updatedItems.splice(itemIndex, 1);
      }
      setItems(updatedItems);
      setTotal(total - parseFloat(product.price));
    }
  };

  const placeOrder = () => {
    dispatch(create_order(items)).then((res) => {
      if (res.error) {
        dispatch(error(res.error.message));
      } else {
        dispatch(success("Placed"));
        dispatch(fetch_my_orders());
      }
      setItems([]);
      setTotal(0.0);
    });
  };

  const Product = (product) => {
    const { name, desc, price, status } = product;
    return (
      <div className="bg-black p-4 bg-opacity-50 rounded-lg">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">{name}</h1>
          <h1>{`$${price}`}</h1>
        </div>
        <p>{desc}</p>
        {status == "available" ? (
          <div className="text-center flex justify-evenly gap-4">
            <button
              className="bg-black bg-opacity-25 p-1 w-full rounded-lg hover:bg-opacity-50"
              onClick={() => removeItem(product)}
            >
              remove
            </button>
            <button
              className="bg-black bg-opacity-25 p-1 w-full rounded-lg hover:bg-opacity-50"
              onClick={() => placeItem(product)}
            >
              add
            </button>
          </div>
        ) : (
          <h1 className="bg-black bg-opacity-25 w-full text-center text-white py-1 cursor-not-allowed">
            not available
          </h1>
        )}
      </div>
    );
  };

  const Order = ({ _id, status, items }) => {
    const [loading, setLoading] = useState(false);
    return (
      <div
        key={_id}
        className="bg-black relative bg-opacity-50 rounded-lg p-4 flex flex-col gap-4"
      >
        <div className="flex w-full justify-between gap-4 items-center">
          <h1 className="bg-black w-full bg-opacity-25 p-1 text-center rounded-lg uppercase">
            {`STATUS : ${status}`}
          </h1>
          <h1 className="w-full text-end">{`TOTAL : $${parseFloat(
            total
          ).toFixed(2)}`}</h1>
        </div>
        <div className="bg-white py-[2px]" />
        <ul>
          {Object.keys(items).map((key) => {
            const { _id, name, quantity } = items[key];
            return (
              <li key={_id}>
                <h1>{`${quantity}x ${name}`}</h1>
              </li>
            );
          })}
        </ul>
        {status == "pending" ? (
          <button
            className="bg-black w-full bg-opacity-25 p-1 text-center rounded-lg uppercase"
            onClick={() => {
              setLoading(true);
              dispatch(update_status({ id: _id, status: "cancelled" })).then(
                (res) => {
                  if (res.error) {
                    dispatch(error(res.error.message));
                  } else {
                    dispatch(success("Cancelled"));
                    dispatch(fetch_my_orders());
                  }
                  setLoading(false);
                }
              );
            }}
          >
            cancel
          </button>
        ) : status == "cancelled" ? (
          <button
            className="bg-black w-full bg-opacity-25 p-1 text-center rounded-lg uppercase"
            onClick={() => {
              setLoading(true);
              dispatch(delete_order(_id)).then((res) => {
                if (res.error) {
                  dispatch(error(res.error.message));
                } else {
                  dispatch(success("Deleted"));
                  dispatch(fetch_my_orders());
                }
                setLoading(false);
              });
            }}
          >
            delete
          </button>
        ) : null}
        {loading && (
          <div className="absolute inset-0  flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-lg">
            <Loader />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row items-center justify-evenly gap-4 py-16 px-4 md:px-8 lg:px-16 h-screen text-white">
        <div className="w-full relative bg-color2 bg-opacity-50 overflow-auto h-full rounded-lg p-4">
          <ul className="flex flex-col gap-4 ">
            {products.map((product) => {
              return (
                <li key={product._id}>
                  <Product {...product} />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-full relative bg-color2 bg-opacity-50 overflow-auto h-full rounded-lg p-4 flex flex-col gap-6">
          <ul className="flex flex-col gap-2 h-[85%] bg-black bg-opacity-25 rounded-lg p-4">
            {items.map((item) => {
              return (
                <li
                  key={item._id}
                  className="flex justify-center items-center bg-black bg-opacity-50"
                >
                  <h1 className="w-1/4">{`${item.quantity}x`}</h1>
                  <h1 className="w-3/4 truncate">{item.name}</h1>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-4 text-xl">
            <h1 className="uppercase font-semibold">total amount:</h1>
            <h1>{`$${total.toFixed(2)}`}</h1>
          </div>
          <div className="">
            <button
              className="bg-color4 bg-opacity-50 p-4 w-full"
              onClick={() => placeOrder()}
            >
              Place Order
            </button>
          </div>
          {loading_create && (
            <div className="absolute inset-0  flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-lg">
              <Loader />
            </div>
          )}
        </div>
        <div className="w-full relative bg-color2 bg-opacity-50 overflow-auto h-full rounded-lg p-4 flex flex-col gap-6">
          <ul className="flex flex-col gap-4 h-full">
            {orders.map((order) => {
              const { _id } = order;
              return (
                <li key={_id}>
                  <Order {...order} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
