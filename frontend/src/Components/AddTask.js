import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useMutation } from "@apollo/client";
import { UPDATEUSER } from "../GraphQl/Mutation";
import { handleAddTask } from "../Services";

export default function AddTask(props) {
  const [inputValue, setInputValue] = useState("");
  const [isInputSelected, setIsInputSelected] = useState(false);
  const [updateUser] = useMutation(UPDATEUSER);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputFocus = () => {
    setIsInputSelected(true);
  };
  const handleInputBlur = () => {
    setIsInputSelected(inputValue !== "");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask(
        inputValue,
        props.setLoad,
        updateUser,
        toast,
        setInputValue
      );
    }
  };
  const handleAddTaskClick = () => {
    handleAddTask(inputValue, props.setLoad, updateUser, toast, setInputValue);
  };

  return (
    <section className="flex w-full -z-[2x] absolute bottom-28 items-center justify-center">
      <div className="relative mt-4 w-60">
        <label
          className={`absolute left-2 transition-all ${
            isInputSelected
              ? "-top-5 text-sm text-gray-300 "
              : "top-2 text-base text-gray-500 font-semibold"
          }  pointer-events-none`}
        >
          ENTER TASK
        </label>
        <input
          className="w-full -z-10 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500"
          type="text"
          placeholder=""
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyPress}
        />
        {!props.load ? (
          <button
            onClick={handleAddTaskClick}
            className="bg-yellow-500 p-2 mt-4 -mb-3 block m-auto text-black text-sm rounded-sm font-semibold"
          >
            Add Task
          </button>
        ) : (
          <Loader />
        )}
      </div>
    </section>
  );
}
