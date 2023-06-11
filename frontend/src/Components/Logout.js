import React from "react";
import { useNavigate } from "react-router-dom";
export default function Logout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/signin");
  };
  const userData = JSON.parse(localStorage.getItem("userData"));
  const email = userData ? userData.email : "";
  return (
    <>
      <div className="absolute  top-2 left-5 text-white">
        <h2 className="text-white text-center">
          Welcome{" "}
          <span className="rotate-180 text-sm inline-block">&#x25B2;</span>
        </h2>

        <p className="text-yellow-500">{email}</p>
      </div>

      <div>
        <button
          className="bg-yellow-500  p-2 mt-2 absolute top-0 right-4  text-black text-sm rounded-sm font-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
}
