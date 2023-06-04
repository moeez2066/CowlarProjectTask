import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { GETALLTASKS } from "../GraphQl/Queries";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { UPDATEUSER } from "../GraphQl/Mutation";

export default function AddTask() {
  
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
      if (inputValue.trim() !== "") {
        const task = {
          task: inputValue,
          completed: false,
          creationTime: new Date().toISOString(),
          completionTime: null,
        };

        updateUser({
          variables: {
            _id: JSON.parse(localStorage.getItem("userData")).email,
            tasks: [task],
          },
          refetchQueries: [
            {
              query: GETALLTASKS,
              variables: {
                id: JSON.parse(localStorage.getItem("userData")).email,
              },
            },
          ],
        })
          .then((response) => {
            toast.success("Task Added ", {
              autoClose: 800,
            });
          })
          .catch((error) => {});

        setInputValue("");
      }
    }
  };

  return (
    <section className="flex w-full absolute bottom-28 items-center justify-center">
      <div className="relative mt-4 w-60">
        <label
          className={`absolute left-2 transition-all ${
            isInputSelected
              ? "-top-5 text-sm text-gray-300 "
              : "top-2 text-base text-gray-500 font-semibold"
          }  pointer-events-none`}
        >
          ADD TASK
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
      </div>
    </section>
  );
}
