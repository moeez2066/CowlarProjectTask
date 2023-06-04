import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { LOADONEUSER } from "../GraphQl/Queries";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
export default function Signin() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    _id: "",
    password: "",
  });
  const [skip, setSkip] = useState(true);
  const { data } = useQuery(LOADONEUSER, {
    variables: { id: userData._id, password: userData.password },
    skip: skip,
  });
  const View = (event) => {
    event.preventDefault();
    setSkip(false);
    setUserData({
      _id: event.target.email.value,
      password: event.target.password.value,
    });
  };

  useEffect(() => {
    if (data) {
      if (data.Oneuser === null) {
        toast.error("No User Found");
      } else {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email: data.Oneuser._id,
          })
        );
        navigate("/?load=true");
      }
    }
  }, [data, skip, navigate]);

  return (
    <section
      id="Sign"
      className="w-screen h-screen flex items-center justify-center"
    >
      <ToastContainer autoClose={900} />
      <div
        className="w-96 mx-auto bg-transparent rounded p-8 shadow border-2 "
        style={{ borderColor: "rgb(222 185 4)" }}
      >
        <h2
          className="text-2xl font-bold mb-8"
          style={{ color: "rgb(222 185 4)" }}
        >
          Sign In
        </h2>
        <form onSubmit={View}>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-blue-500"
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              name="email"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-blue-500"
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              name="password"
            />
          </div>
          <button
            className="w-full bg-blue-500 border-blue-500 text-white font-bold py-[7px] px-4 rounded hover:bg-transparent border-[1px] transition-all hover:border-gray-400 focus:outline-none "
            type="submit"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-400">Not have an account? </span>
          <Link className="text-blue-500 hover:text-blue-700" to="/signup">
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
}
