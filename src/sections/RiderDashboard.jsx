import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import {
  deliver_order,
  fetch_orders,
  update_status,
} from "../redux/reducers/order_slice";
import Loader from "../components/Loader";
import { error, success } from "../redux/reducers/notification_slice";

export default function RiderDashboard() {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetch_orders());
  }, []);

  const Order = ({ _id, customer, items, total, status }) => {
    const [loading, setLoading] = useState(false);
    return (
      <div className="bg-black relative bg-opacity-25 p-4 rounded-lg text-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1>{customer}</h1>
          <h1>{`$${parseFloat(total).toFixed(2)}`}</h1>
        </div>
        <div className="bg-white py-[1px]" />
        <ul>
          {Object.keys(items).map((key) => {
            const { _id, name, quantity } = items[key];
            return (
              <li key={_id}>
                <h1>{`${quantity}x - ${name}`}</h1>
              </li>
            );
          })}
        </ul>
        <div className="bg-white py-[1px]" />
        <div className="flex flex-col lg:flex-row w-full justify-evenly gap-4">
          {status == "serving" ? (
            <button
              className="bg-black bg-opacity-50  p-1 rounded-lg uppercase w-full hover:bg-opacity-75"
              onClick={() => {
                setLoading(true);
                dispatch(deliver_order(_id)).then((res) => {
                  if (res.error) {
                    dispatch(error(res.error.message));
                  } else {
                    dispatch(success("Delivering"));
                    dispatch(fetch_orders());
                  }
                  setLoading(false);
                });
              }}
            >
              Deliver
            </button>
          ) : status == "delivering" ? (
            <button
              className="bg-black bg-opacity-50  p-1 rounded-lg uppercase w-full hover:bg-opacity-75"
              onClick={() => {
                setLoading(true);
                dispatch(update_status({ id: _id, status: "delivered" })).then(
                  (res) => {
                    if (res.error) {
                      dispatch(error(res.error.message));
                    } else {
                      dispatch(success("Updated"));
                      dispatch(fetch_orders());
                    }
                    setLoading(false);
                  }
                );
              }}
            >
              set as Delivered
            </button>
          ) : (
            <h1 className="bg-black bg-opacity-25  p-1 rounded-lg uppercase w-full text-center cursor-not-allowed">
              {status}
            </h1>
          )}
        </div>
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
      <div className="flex flex-col lg:flex-row items-end gap-4 py-16 px-4 md:px-8 lg:px-16 h-screen text-white">
        <div className="w-full  flex-col lg:flex-row  relative h-full rounded-lg p-4 flex gap-4">
          <ul className="flex bg-color1 bg-opacity-25 rounded-lg p-4 flex-col gap-4 w-full overflow-auto">
            {orders
              .filter((order) =>
                ["pending", "preparing"].includes(order.status)
              )
              .map((order) => {
                return (
                  <li key={order._id}>
                    <Order {...order} />
                  </li>
                );
              })}
          </ul>
          <ul className="flex flex-col bg-color1 bg-opacity-25 rounded-lg p-4 gap-4 w-full overflow-auto">
            {orders
              .filter((order) => order.status === "serving")
              .map((order) => {
                return (
                  <li key={order._id}>
                    <Order {...order} />
                  </li>
                );
              })}
          </ul>
          <ul className="flex flex-col gap-4 bg-color1 bg-opacity-25 rounded-lg p-4 overflow-auto w-full">
            {orders
              .filter(
                (order) =>
                  order.rider &&
                  order.status == "delivering" &&
                  order.rider.id == user._id
              )
              .map((order) => {
                return (
                  <li key={order._id}>
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
