import React, { useEffect } from "react";
import Hero from "../sections/Hero";
import Signin from "../sections/Signin";
import { useDispatch, useSelector } from "react-redux";
import { fetch_user } from "../redux/reducers/user_slice";
import Loader from "../components/Loader";
import AdminDashboard from "../sections/AdminDashboard";
import CustomerDashboard from "../sections/CustomerDashboard";
import RiderDashboard from "../sections/RiderDashboard";

export default function Homepage() {
  const { user, loading_user, loading_logout } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetch_user());
  }, []);

  return (
    <>
      {loading_user || loading_logout ? (
        <div className="bg-image flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          {user ? (
            <div className="bg-image">
              {user.role == "admin" ? (
                <AdminDashboard />
              ) : user.role == "customer" ? (
                <CustomerDashboard />
              ) : (
                <RiderDashboard />
              )}
            </div>
          ) : (
            <div className="bg-image justify-center lg:justify-evenly flex flex-col lg:flex-row gap-4 lg:gap-0">
              <Hero />
              <Signin />
            </div>
          )}
        </>
      )}
    </>
  );
}
