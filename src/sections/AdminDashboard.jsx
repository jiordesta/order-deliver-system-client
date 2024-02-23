import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  create_product,
  delete_product,
  fetch_products,
  update_product,
} from "../redux/reducers/product_slice";
import { error, success } from "../redux/reducers/notification_slice";
import Loader from "../components/Loader";
import Header from "./Header";
import {
  delete_order,
  fetch_orders,
  update_status,
} from "../redux/reducers/order_slice";

export default function AdminDashboard() {
  const [showAdd, setShowAdd] = useState(false);
  const { products, loading_products } = useSelector((state) => state.product);
  const { orders, loading_orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetch_products());
    dispatch(fetch_orders());
  }, [showAdd]);

  const Order = ({ _id, customer, items, total, status, rider }) => {
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
        {status == "delivering" ? (
          <h1 className="bg-black p-2 bg-opacity-50 w-full rounded-lg uppercase">
            {`RIDER - ${rider.name}`}
          </h1>
        ) : (
          <div className="flex flex-col lg:flex-row w-full justify-evenly gap-4">
            <div className="flex gap-4 justify-center items-center w-full">
              <h1>STATUS:</h1>
              <select
                name="Update Status"
                className="bg-black bg-opacity-50 p-1 rounded-lg uppercase w-full"
                onChange={(e) => {
                  setLoading(true);
                  dispatch(
                    update_status({ id: _id, status: e.target.value })
                  ).then((res) => {
                    if (res.error) {
                      dispatch(error(res.error.message));
                    } else {
                      dispatch(success("Updated"));
                      dispatch(fetch_orders());
                    }
                    setLoading(false);
                  });
                }}
                value={status}
              >
                <option value={"pending"}>pending</option>
                <option value={"preparing"}>preparing</option>
                <option value={"serving"}>serving</option>
                <option value={"delivering"}>delivering</option>
                <option value={"delivered"}>delivered</option>
                <option value={"cancelled"}>cancelled</option>
              </select>
            </div>
            <button
              className="bg-black bg-opacity-50  p-1 rounded-lg uppercase w-full hover:bg-opacity-75"
              onClick={() => {
                setLoading(true);
                dispatch(delete_order(_id)).then((res) => {
                  if (res.error) {
                    dispatch(error(res.error.message));
                  } else {
                    dispatch(success("Deleted"));
                    dispatch(fetch_orders());
                  }
                  setLoading(false);
                });
              }}
            >
              Delete
            </button>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0  flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-lg">
            <Loader />
          </div>
        )}
      </div>
    );
  };

  const Product = ({ name, price, desc, status, _id }) => {
    const [loading, setLoading] = useState(false);

    const handleUpdate = () => {
      setLoading(true);
      dispatch(update_product(_id)).then((res) => {
        if (res.error) {
          dispatch(error(res.error.message));
        } else {
          dispatch(success("Updated"));
          dispatch(fetch_products());
        }
        setLoading(false);
      });
    };

    const handleDelete = () => {
      setLoading(true);
      dispatch(delete_product(_id)).then((res) => {
        if (res.error) {
          dispatch(error(res.error.message));
        } else {
          dispatch(success("Removed"));
          dispatch(fetch_products());
        }
        setLoading(false);
      });
    };

    return (
      <div className="bg-black relative bg-opacity-25 rounded-lg text-white p-4">
        <div className="flex justify-between">
          <h1 className="text-xl">{name}</h1>
          <h1>{`$${price}`}</h1>
        </div>
        <p>{desc}</p>
        <div className="flex gap-4">
          <button
            className="bg-black w-full bg-opacity-50 hover:bg-opacity-75 p-1 rounded-lg mt-2"
            onClick={() => handleUpdate()}
          >
            {status}
          </button>
          <button
            className="bg-black w-full bg-opacity-50 hover:bg-opacity-75 p-1 rounded-lg mt-2"
            onClick={() => handleDelete()}
          >
            remove
          </button>
        </div>
        {loading && (
          <div className="absolute inset-0  flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-lg">
            <Loader w={120} h={120} />
          </div>
        )}
      </div>
    );
  };

  const AddNewProduct = () => {
    const { loading_create } = useSelector((state) => state.product);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [desc, setDesc] = useState("");

    const handleCreate = () => {
      dispatch(create_product({ name, price, desc })).then((res) => {
        if (res.error) {
          dispatch(error(res.error.message));
        } else {
          dispatch(success("Created"));
        }
      });
    };

    return (
      <div className="absolute inset-0 bg-color4 rounded-lg flex flex-col justify-center items-center">
        <div className="relative flex flex-col gap-4 w-full h-full p-4 ">
          <input
            type="text"
            placeholder="Product Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded-lg bg-black bg-opacity-25 placeholder:text-white focus:bg-opacity-10 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 rounded-lg bg-black bg-opacity-25 placeholder:text-white focus:bg-opacity-10 focus:outline-none"
          />
          <textarea
            rows={10}
            placeholder="Description"
            onChange={(e) => setDesc(e.target.value)}
            className="w-full p-2 rounded-lg bg-black bg-opacity-25 placeholder:text-white focus:bg-opacity-10 focus:outline-none"
          />
          <div className="flex gap-4">
            <button
              className="bg-color3 p-2 rounded-lg hover:bg-opacity-75 w-full"
              onClick={() => handleCreate()}
            >
              Add
            </button>
            <button
              className="bg-color3 p-2 rounded-lg hover:bg-opacity-75 w-full"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </button>
          </div>
          {loading_create && (
            <div className="absolute inset-0  flex flex-col justify-center items-center bg-black bg-opacity-25 rounded-lg">
              <Loader />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row items-center justify-evenly gap-4 py-16 px-4 md:px-8 lg:px-16 h-screen text-white">
        <div className="w-full relative bg-color2 bg-opacity-50 overflow-auto h-full rounded-lg p-4">
          <ul className="flex flex-col gap-4 ">
            {orders
              .filter((order) => !order.rider)
              .map((order) => {
                return (
                  <li key={order._id}>
                    <Order {...order} />
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="w-full relative bg-color2 bg-opacity-50 overflow-auto h-full rounded-lg p-4">
          <ul className="flex flex-col gap-4 ">
            {orders
              .filter((order) => order.rider)
              .map((order) => {
                return (
                  <li key={order._id}>
                    <Order {...order} />
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="w-full relative bg-color2 bg-opacity-50  overflow-auto h-full  rounded-lg p-4">
          <button
            className="bg-black bg-opacity-50 w-full p-2 uppercase rounded-lg hover:bg-opacity-75"
            onClick={() => setShowAdd(true)}
          >
            add new
          </button>
          {showAdd ? (
            <AddNewProduct />
          ) : (
            <ul className="flex flex-col gap-4 mt-4">
              {products.map((product) => {
                return (
                  <li key={product._id}>
                    <Product {...product} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
