import React, { useState } from "react";
import { GETALLTASKS } from "../GraphQl/Queries";
import { UPDATE_TASK_COMPLETION, REMOVE_TASK } from "../GraphQl/Mutation";
import { useMutation, useQuery } from "@apollo/client";
import { FaGripVertical } from "react-icons/fa";
import { toast } from "react-toastify";
export default function TodoDD() {
  const [isOpen, setIsOpen] = useState(false);
  const [box, setBox] = useState(false);
  const [taskindex, setTaskindex] = useState(0);
  const [UPDATE_TASK] = useMutation(UPDATE_TASK_COMPLETION);
  const [REMOVETASK] = useMutation(REMOVE_TASK);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const email = userData ? userData.email : "";
  const { loading, error, data } = useQuery(GETALLTASKS, {
    variables: { id: email },
  });

  const toggleDropdown = () => {
    if (isOpen) {
      setBox(false);
    }
    setIsOpen(!isOpen);
  };

  const showTaskDetails = (index) => {
    setBox(true);
    setTaskindex(index);
    setTimeout(() => {
      const detailsElement = document.getElementById("details");
      detailsElement.innerHTML =
        "Task : &nbsp;&nbsp;" +
        data.taskUser.tasks[index].task +
        "<br>" +
        "Creation Time : &nbsp;&nbsp;" +
        data.taskUser.tasks[index].creationTime +
        "<br>" +
        "Completed : &nbsp;&nbsp;" +
        data.taskUser.tasks[index].completed +
        "<br>" +
        "Completed Time : &nbsp;&nbsp;" +
        (data.taskUser.tasks[index].completionTime === null
          ? ""
          : data.taskUser.tasks[index].completionTime);
    }, 0);
  };

  const handleItemClick = (index) => {
    setBox(false);
    UPDATE_TASK({
      variables: {
        _id: JSON.parse(localStorage.getItem("userData")).email,
        taskIndex: index,
        completionTime: new Date().toISOString(),
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
      .then((response) => {})
      .catch((error) => {});
  };

  const removeusertask = () => {
    setBox(false);
    REMOVETASK({
      variables: {
        _id: JSON.parse(localStorage.getItem("userData")).email,
        taskIndex: taskindex,
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
        toast.success("Task Deleted", {
          autoClose: 800,
        });
      })
      .catch((error) => {});
  };

  return (
    <section className="flex w-screen items-center absolute justify-center mt-8">
      <div className="relative  w-80">
        <button
          className="flex items-center justify-between px-4 py-2 w-full bg-transparent  shadow-effect   rounded-md focus:outline-none focus:shadow-outline"
          onClick={toggleDropdown}
        >
          <span className="font-semibold text-white ">
            {" "}
            <span className="mr-3  text-gray-500 text-lg ">☰</span>To do today
          </span>
          <span
            className={`ml-2 text-gray-500 transition-all transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            &#x5E;
          </span>
        </button>
        {isOpen && (
          <div className="absolute z-10  top-11 mt-2 w-full transition-all  rounded-lg shadow-lg">
            <ul className="py-2 bg-gray-200 max-h-[58vh] min-h-[58vh] transition-all overflow-y-auto rounded-lg hidescrollbar">
              {loading ? (
                <li>Loading...</li>
              ) : error ? (
                <li>Error: {error.message}</li>
              ) : (
                data.taskUser.tasks.map((task, index) => (
                  <React.Fragment key={task.creationTime}>
                    <li className="pt-1 pb-4 flex items-center justify-center">
                      <div>
                        <span
                          className={`cursor-pointer w-2 h-2 mx-4 px-[0.4rem] text-center text-[0.5rem] py-1 rounded-full ${
                            task.completed
                              ? "bg-black text-white"
                              : "bg-gray-200 border border-black py-[0.10rem] px-[0.51rem]"
                          }`}
                          onClick={() => handleItemClick(index)}
                        >
                          {task.completed ? "\u2713" : ""}
                        </span>

                        <span>{task.task}</span>
                      </div>
                      <span className="ml-auto  mr-3 cursor-pointer ">
                        <FaGripVertical
                          onClick={() => showTaskDetails(index)}
                          className="text-gray-500 hover:text-yellow-500"
                        />
                      </span>
                    </li>
                    <hr className="h-1 border-gray-300" />
                  </React.Fragment>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      {box && (
        <div className="absolute leading-10 left-[65%] top-[12%] border-[1px] border-gray-200 bg-black rounded-lg p-3 pt-0 transition-all text-white">
          <span
            onClick={() => setBox(false)}
            className="float-right hover:cursor-pointer p-0 m-0 leading-7 text-lg text-yellow-500 hover:text-red-500"
          >
            x
          </span>
          <br />
          <span id="details"></span>
          <br />
          <hr className="w-60 my-4 text-black bg-black  border-gray-500 block m-auto " />
          <button
            onClick={() => removeusertask()}
            className="bg-yellow-500 p-1 mt-2 text-black text-sm rounded-sm block m-auto"
          >
            Delete Task
          </button>
        </div>
      )}
    </section>
  );
}
