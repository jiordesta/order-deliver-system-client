import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetch_user, login, register } from "../redux/reducers/user_slice";
import { error, success } from "../redux/reducers/notification_slice";
import Loader from "../components/Loader";

export default function Signin() {
  const { loading_login, loading_register } = useSelector(
    (state) => state.user
  );
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
      dispatch(login({ username, password })).then((res) => {
        if (res.error) {
          dispatch(error(res.error.message));
        } else {
          dispatch(success("Logged in"));
          dispatch(fetch_user());
        }
      });
    };

    return (
      <div className="relative bg-color2 w-full lg:w-1/2  bg-opacity-50 rounded-lg p-4 flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-color1 p-2 rounded-md focus:outline-none placeholder:text-color4 text-color4 bg-opacity-25 focus:bg-opacity-50"
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-color1 p-2 rounded-md focus:outline-none placeholder:text-color4 text-color4 bg-opacity-25 focus:bg-opacity-50"
        />
        <div className="flex justify-center items-center">
          <input type="checkbox" />
          <h1>Remember me</h1>
        </div>
        <button
          className="bg-color2 py-2 rounded-lg text-xl font-semibold bg-opacity-50 hover:bg-opacity-75"
          onClick={() => handleLogin()}
        >
          Login
        </button>
        <button className="underline" onClick={() => setShow(true)}>
          i don't have an account
        </button>
        {loading_login && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col text-white items-center justify-center">
            <Loader w={100} h={100} />
            <h1>Please wait..</h1>
          </div>
        )}
      </div>
    );
  };

  const Register = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [image, setImage] = useState(null);

    const handleRegister = () => {
      dispatch(
        register({ fname, lname, username, password, role, image })
      ).then((res) => {
        if (res.error) {
          dispatch(error(res.error.message));
        } else {
          dispatch(success("Registered"));
          setShow(false);
        }
      });
    };

    return (
      <div className="relative bg-color2 w-full lg:w-1/2  bg-opacity-50 rounded-lg p-4 flex flex-col gap-4">
        <input
          type="text"
          placeholder="first name"
          onChange={(e) => setFname(e.target.value)}
          className="w-full bg-color1 p-2 rounded-md focus:outline-none placeholder:text-color4 text-color4 bg-opacity-25 focus:bg-opacity-50"
        />
        <input
          type="text"
          placeholder="last name"
          onChange={(e) => setLname(e.target.value)}
          className="w-full bg-color1 p-2 rounded-md focus:outline-none placeholder:text-color4 text-color4 bg-opacity-25 focus:bg-opacity-50"
        />
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-color1 p-2 rounded-md focus:outline-none placeholder:text-color4 text-color4 bg-opacity-25 focus:bg-opacity-50"
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-color1 p-2 rounded-md focus:outline-none placeholder:text-color4 text-color4 bg-opacity-25 focus:bg-opacity-50"
        />
        <div className="flex justify-center items-center">
          <h1 className="w-1/4 text-center bg-color1 bg-opacity-50 rounded-l-lg">
            Role
          </h1>
          <select className="w-3/4" onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="rider">Rider</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="3/4"
        />
        <button
          className="bg-color2 py-2 rounded-lg text-xl font-semibold bg-opacity-50 hover:bg-opacity-75"
          onClick={() => handleRegister()}
        >
          Register
        </button>
        <button className="underline" onClick={() => setShow(false)}>
          already have an account
        </button>
        {loading_register && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col text-white items-center justify-center">
            <Loader w={100} h={100} />
            <h1>Please wait..</h1>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center items-center text-color4 px-8">
      {show ? <Register /> : <Login />}
    </div>
  );
}
