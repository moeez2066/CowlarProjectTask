import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import Todo from "./TodoDD";
import AddTask from "./AddTask";
import Logout from "./Logout";
export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/signin");
    } else {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has("load")) {
        toast.success("Logged in Successfully");
        searchParams.delete("load");
        const newSearch = searchParams.toString();
        navigate({ search: newSearch }, { replace: true });
      }
    }
  }, [navigate, location.search]);
  return (
    <>
      <ToastContainer autoClose={800} />
      <section id="home">
        <div className="flex items-center pt-3 justify-center  bg-transparent">
          <h1 className="text-4xl font-bold text-yellow-500 ">
            Welcome to <span className="text-white">TODO</span>
          </h1>
        </div>
        <div className="flex items-center justify-center  bg-transparent">
          <div className="rounded-full overflow-hidden w-20 h-20 mt-6 border-4 border-yellow-500">
            <img
              className="object-cover w-full h-full"
              src={localStorage.getItem("imageData")}
              alt=""
            />
          </div>
        </div>
        <Todo />
        <AddTask />
        <Logout />
      </section>
    </>
  );
}
