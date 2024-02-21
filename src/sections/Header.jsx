import React from "react";
import { useDispatch } from "react-redux";
import { fetch_user, logout } from "../redux/reducers/user_slice";
import { error } from "../redux/reducers/notification_slice";

export default function Header() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()).then((res) => {
      if (res.error) {
        dispatch(error(res.error.message));
      } else {
        dispatch(fetch_user());
      }
    });
  };

  return (
    <div className=" px-8 py-4 fixed md:px-16 lg:px-32 flex justify-end items-center w-full">
      <ul className="flex gap-4 text-xl">
        <li
          className="bg-color3 bg-opacity-50 px-8 rounded-lg hover:bg-opacity-75 cursor-pointer"
          onClick={() => handleLogout()}
        >
          Logout
        </li>
      </ul>
    </div>
  );
}
