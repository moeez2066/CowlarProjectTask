import { gql } from "@apollo/client";

export const ADDUSER = gql`
  mutation add($_id: String!, $password: String!) {
    addUser(_id: $_id, password: $password) {
      _id
    }
  }
`;
export const UPDATEUSER = gql`
  mutation UpdateUser($_id: String!, $task: TaskInput!) {
    updateUser(_id: $_id, task: $task) {
      _id
    }
  }
`;

export const UPDATE_TASK_COMPLETION = gql`
  mutation updateTaskCompletion($userId: String!, $taskId: Int!) {
    updateTaskCompletion(userId: $userId, taskId: $taskId) {
      _id
    }
  }
`;

export const REMOVE_TASK = gql`
  mutation RemoveTask($userId: String!, $taskId: Int!) {
    removeTask(userId: $userId, taskId: $taskId) {
      _id
    }
  }
`;
