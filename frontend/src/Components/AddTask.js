import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useUpdateUser } from "../useApi";
import { handleAddTask } from "../Services";

export default function AddTask(props) {
  const [inputValue, setInputValue] = useState("");
  const [isInputSelected, setIsInputSelected] = useState(false);
  const [updateUser] = useUpdateUser();
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
    setIsInputSelected(false);
    handleAddTask(inputValue, props.setLoad, updateUser, toast, setInputValue);
  };

  return (
    <section className="flex w-full  h-min fixed bottom-0 items-center justify-center mb-20 ">
      <div className="relative w-80 bg-white rounded shadow-lg">
        <h2 className="px-4 py-2 text-lg font-semibold text-gray-800">
          Add a Task
        </h2>
        <div className="px-4 py-2 ">
          <label
            className={`absolute left-4 top-4 transition-all ${
              isInputSelected
                ? "-top-5 text-xs text-gray-400"
                : "top-4 text-sm text-gray-600 font-semibold"
            } pointer-events-none bg-white px-1`}
          >
            Task Description
          </label>
          <input
            className="w-full py-2 pl-2 pr-8 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            placeholder="Enter task description"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyPress}
            aria-label="Task Description"
          />
        </div>
        <div className="flex justify-end px-4 py-2">
          {!props.load ? (
            <button
              onClick={handleAddTaskClick}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded hover:bg-indigo-600"
            >
              Add Task
            </button>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </section>
  );
}
