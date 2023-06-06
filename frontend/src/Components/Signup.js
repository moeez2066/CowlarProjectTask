import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADDUSER } from "../GraphQl/Mutation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { handle_image_change, _ADD_ } from "../Services";
export default function Signup(props) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    _id: "",
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [Adduser, { data }] = useMutation(ADDUSER, {
    variables: {
      _id: userData._id,
      password: userData.password,
    },
  });
  const Add = (event) => {
    _ADD_(event, props, toast, Adduser, setUserData);
  };

  const handleImageChange = (event) => {
    handle_image_change(event, setSelectedImage);
  };

  useEffect(() => {
    if (data) {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          email: data.addUser._id,
        })
      );
      navigate("/?load=true");
    }
  }, [data, userData, navigate]);

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
          Sign Up
        </h2>
        <form onSubmit={Add}>
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
              name="password"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Profile Picture
            </label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={handleImageChange}
              name="profile"
              className="cursor-pointer text-white"
            />

            {selectedImage && (
              <div className="flex items-center justify-center">
                <div className="rounded-full overflow-hidden w-20 h-20 mt-4 -mb-4 border-4 border-yellow-500">
                  <img
                    className="object-cover w-full h-full"
                    src={selectedImage}
                    alt=""
                  />
                </div>
              </div>
            )}
            <br />
          </div>
          {!props.load ? (
            <button
              className="w-full bg-blue-500 border-blue-500 text-white font-bold py-[7px] px-4 rounded hover:bg-transparent border-[1px] transition-all hover:border-gray-400 focus:outline-none "
              type="submit"
            >
              Sign Up
            </button>
          ) : (
            <div className="ml-10 mb-5 -mt-10">
              <Loader />
            </div>
          )}
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-400">Already have an account?</span>
          <Link className="text-blue-500 hover:text-blue-700" to="/signin">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
