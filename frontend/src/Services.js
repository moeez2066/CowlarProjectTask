import { GETALLTASKS } from "./GraphQl/Queries";

export function handleAddTask(
  inputValue,
  setLoad,
  updateUser,
  toast,
  setInputValue
) {
  if (inputValue.trim() !== "") {
    setLoad(true);
    const inputTask = {
      task: inputValue,
    };

    updateUser({
      variables: {
        _id: JSON.parse(localStorage.getItem("userData")).email,
        task: inputTask,
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
        setLoad(false);
        toast.success("Task added to your todo list ", {
          autoClose: 1000,
        });
      })
      .catch((error) => {
        setLoad(false);
        toast.error("Failed to add task", {
          autoClose: 1000,
        });
      });
    setInputValue("");
  }
}

export function REMOVEUSERTASK(props, taskindex, toast, REMOVETASK, setBox) {
  props.setLoad(true);

  REMOVETASK({
    variables: {
      userId: JSON.parse(localStorage.getItem("userData")).email,
      taskId: taskindex,
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
      setBox(false);
      props.setLoad(false);
      toast.success("Task deleted from your todo list ", {
        autoClose: 800,
      });
    })
    .catch((error) => {
      props.setLoad(false);
      toast.success("Failed to delete task from your todo list ", {
        autoClose: 800,
      });
    });
}
export function handle_Item_Click(setBox, toast, UPDATE_TASK, index) {
  setBox(false);
  toast.info("Marking test in progress...", {
    autoClose: 1000,
  });
  UPDATE_TASK({
    variables: {
      userId: JSON.parse(localStorage.getItem("userData")).email,
      taskId: index,
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
      toast.success("Task marked as completed", {
        autoClose: 1000,
      });
    })
    .catch((error) => {
      toast.error("Failed to mark task as completed", {
        autoClose: 1000,
      });
    });
}

export function show_Task_Details(setBox, setTaskindex, index, data) {
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
      "Completed ? : &nbsp;&nbsp;" +
      (data.taskUser.tasks[index].completed === false
        ? "Pending"
        : "Completed") +
      "<br>" +
      "Completion Time : &nbsp;&nbsp;" +
      (data.taskUser.tasks[index].completionTime === null
        ? "Pending"
        : data.taskUser.tasks[index].completionTime);
  }, 0);
}
export function handle_image_change(event, setSelectedImage) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        const resizedDataURL = canvas.toDataURL("image/jpeg", 0.8);
        localStorage.setItem("imageData", resizedDataURL);
        setSelectedImage(resizedDataURL);
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  }
}

export function _ADD_(event, props, toast, Adduser, setUserData) {
  props.setLoad(true);
  event.preventDefault();
  setUserData({
    _id: event.target.email.value,
    password: event.target.password.value,
  });
  setTimeout(() => {
    Adduser().catch((error) => {
      if (error.message === "User already exists") {
        toast.error("Email Already Exists ");
        props.setLoad(false);
      } else {
        toast.error("Sign up failed !!");
        props.setLoad(false);
      }
    });
  }, 0);
  props.setLoad(false);
}
