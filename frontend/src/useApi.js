import { UPDATEUSER } from "./GraphQl/Mutation";
import {
  ADDUSER,
  UPDATE_TASK_COMPLETION,
  REMOVE_TASK,
}from "./GraphQl/Mutation";
import { useMutation, useQuery } from "@apollo/client";
import { LOADONEUSER, GETALLTASKS } from "./GraphQl/Queries";
export function useUpdateUser() {
  return useMutation(UPDATEUSER);
}
export function useAddUser(userData) {
  return useMutation(ADDUSER, {
    variables: {
      _id: userData._id,
      password: userData.password,
    },
  });
}
export function useLoadOneUser(userData, skip) {
  return useQuery(LOADONEUSER, {
    variables: { id: userData._id, password: userData.password },
    skip: skip,
  });
}
export function useUpdateTaskCompletion() {
  return useMutation(UPDATE_TASK_COMPLETION);
}
export function useRemoveTask() {
  return useMutation(REMOVE_TASK);
}
export function useGetAllTasks() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const email = userData ? userData.email : "";
  return useQuery(GETALLTASKS, {
    variables: { id: email },
  });
}
