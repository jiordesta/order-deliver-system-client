import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  create_product,
  fetch_products,
  update_product,
} from "../redux/reducers/product_slice";
import { error, success } from "../redux/reducers/notification_slice";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const [showAdd, setShowAdd] = useState(false);
  const { products } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetch_products());
  }, []);

  const Order = () => {
    return (
      <div className="bg-black bg-opacity-25 rounded-lg text-white">
        <div className="flex justify-between px-4 py-4 items-center">
          <h1>John Irson Ordesta</h1>
          <button className="bg-color3 uppercase p-1 rounded-lg">
            PENDING
          </button>
        </div>
        <div className="bg-white py-[1px] mx-4" />
        <ul className="px-4">
          <li className="flex gap-4">
            <h1>9x</h1>
            <h1>-</h1>
            <h1>sample product no. 1</h1>
          </li>
          <li className="flex gap-4">
            <h1>68x</h1>
            <h1>-</h1>
            <h1>sample product no. 2</h1>
          </li>
        </ul>
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

    return (
      <div className="bg-black relative bg-opacity-25 rounded-lg text-white p-4">
        <div className="flex justify-between">
          <h1 className="text-xl">{name}</h1>
          <h1>{`$${price}`}</h1>
        </div>
        <p>{desc}</p>
        <button
          className="bg-black w-full bg-opacity-50 hover:bg-opacity-75 p-1 rounded-lg mt-2"
          onClick={() => handleUpdate()}
        >
          {status}
        </button>
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
      <div className="absolute inset-0 bg-color3 rounded-lg flex flex-col justify-center items-center">
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
              className="bg-color2 p-2 rounded-lg hover:bg-opacity-75 w-full"
              onClick={() => handleCreate()}
            >
              Add
            </button>
            <button
              className="bg-color2 p-2 rounded-lg hover:bg-opacity-75 w-full"
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
    <div className="flex flex-col lg:flex-row items-center justify-evenly gap-4 p-8 md:p-16 lg:p-32 h-screen text-white">
      <div className="w-full bg-color2 bg-opacity-50 h-full rounded-lg p-4">
        <ul className="flex flex-col gap-4 overflow-auto h-full">
          <li>
            <Order />
          </li>
          <li>
            <Order />
          </li>
        </ul>
      </div>
      <div className="w-full relative bg-color2 bg-opacity-50 h-full rounded-lg p-4">
        <button
          className="bg-black bg-opacity-50 w-full p-2 uppercase rounded-lg hover:bg-opacity-75"
          onClick={() => setShowAdd(true)}
        >
          add new
        </button>

        {showAdd ? (
          <AddNewProduct />
        ) : (
          <ul className="flex flex-col gap-4 overflow-auto h-[615px] mt-4">
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
  );
}
